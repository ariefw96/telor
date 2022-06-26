const productModel = require('../../model/product_model');
const { baseResponse, errorResponse } = require('../../utils/responseUtils');
const constantResp = require('../../utils/constantMessage');
const formidable = require('formidable');
const fs = require('fs');
const pathlib = require('path');
const directory = "./public/images";
const moment = require('moment');
// const logger = require('logger').createLogger();

exports.add_product = async function (req, res) {
    const now = new Date();
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { prodName, prodSubtitle, prodInstruction, prodSlug, prodCategory } = fields;
            const { path, size, name, type } = files.prodThumbnail;
            const image_name = moment().unix();
            const extFile = pathlib.extname(name);
            const file_name = image_name + extFile;
            const fileUpload = pathlib.join(directory, file_name);
            fs.createReadStream(path)
                .pipe(fs.createWriteStream(fileUpload))
                .on('error', function () {
                    throw "failed to create file"
                })
                .on('finish', function () {
                    fs.unlink(path, (err => {
                        if (err) {
                            console.log(err);
                            throw "Failed to delete temp file"
                        }
                    }));
                });
            const dataProduct = {
                name: prodName,
                subtitle: prodSubtitle,
                thumbnail: `/images/${file_name}`,
                instruction_text : prodInstruction,
                slug : prodSlug,
                created_at: now,
                updated_at: now,
                category_id : prodCategory,
                status: 1
            }
            try{
                await productModel.create(dataProduct);
                // logger.info(moment().toString() + " || " + constantResp.successCreateProduct, dataProduct);
                return res.status(200).json(
                    baseResponse(
                        200,
                        constantResp.successCreateProduct,
                        dataProduct
                    )
                )
            }catch(sqlError){
                console.log("SQL ERROR!", sqlError);
                throw sqlError.toString();
            }
        });
    } catch (e) {
        // logger.error(moment().toString() + " || " + constantResp.internalServerError, e.toString());
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,
                e.toString()
            )
        );
    }
}

exports.all_product = async function (req, res) {
    try {
        const dataProduct = await productModel.findAll();
        const succesResp = baseResponse(
            200,"Data berhasil ditampilkan", dataProduct
        );
        return res.status(200).json(succesResp);
    } catch (e) {
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,

            )
        );
    }
}

exports.get_single_product = async function (req, res) {
    try {
        const { id } = req.query
        const dataProduct = await productModel.findOne({
            where: {
                id
            }
        });
        return res.status(200).json(
            baseResponse(
                200,
                dataProduct == null ? 'Produk tidak ditemukan' : 'Produk berhasil ditampilkan', 
                dataProduct
            )
        );
    } catch (e) {
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,
                e.toString()
            )
        );
    }
}

exports.update_product = async function (req, res) {
    const now = new Date();
    try {
        const { id } = req.query;
        const findData = await productModel.findOne({
            where: {
                id
            }
        });
        if (findData == null) {
            throw "Data tidak ditemukan";
        } else {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const { prodName, prodSubtitle, prodInstruction, prodSlug, prodCategory } = fields;
                console.log("reqFiles", files);
                if (files?.prodThumbnail?.size > 0) {
                    console.log("update with img");
                    const { path, size, name, type } = files.prodThumbnail;
                    const image_name = moment().unix();
                    const extFile = pathlib.extname(name);
                    const file_name = image_name + extFile;
                    const fileUpload = pathlib.join(directory, file_name);
                    fs.createReadStream(path)
                        .pipe(fs.createWriteStream(fileUpload))
                        .on('error', function () {
                            console.log("failed")
                            throw "Failed to create file"
                        })
                        .on('finish', function () {
                            console.log("success")
                            fs.unlink(path, (err => {
                                if (err) {
                                    console.log(err);
                                    throw "Failed to delete temp file"
                                }
                            }));
                        });
                    const updateData = {
                        name: prodName,
                        subtitle: prodSubtitle,
                        thumbnail: `/images/${file_name}`,
                        instruction_text: prodInstruction,
                        slug: prodSlug,
                        updated_at: now,
                        category_id: prodCategory,
                        status: 1
                    }
                    try{
                        await productModel.update(updateData, {
                            where: {
                                id
                            }
                        });
                        fs.unlink(`./public${findData.thumbnail}`, (err => {
                            if (err) {
                                console.log("Failed to delete Old File", err);
                            }
                        }));
                        res.status(200).json(
                            baseResponse(
                                200,
                                constantResp.successUpdateProduct,
                                updateData
                            )
                        );
                    }catch(sqlError){
                        console.log("ERR!", sqlError);
                        throw sqlError.toString();
                    }
                } else {
                    console.log("update without img")
                    const updateData = {
                        name: prodName,
                        subtitle: prodSubtitle,
                        instruction_text : prodInstruction,
                        slug : prodSlug,
                        updated_at: now,
                        category_id : prodCategory,
                        status: 1
                    }
                    try{
                        await productModel.update(updateData, {
                            where: {
                                id
                            }
                        });
                        res.status(200).json(
                            baseResponse(
                                200,
                                constantResp.successUpdateProduct,
                                updateData
                            )
                        );
                    }catch(sqlError){
                        console.log("ERR!", sqlError);
                        throw sqlError.toString();
                    }
                }
            });
        }
    } catch (e) {
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,
                e.toString()
            )
        );
    }
}

exports.delete_product = async function (req, res) {
    const { id } = req.query;
    try {
        const isFound = await productModel.findOne({
            where: {
                id
            }
        });
        if (isFound == null) {
            throw "Item tidak ditemukan"
        } else {
            await productModel.destroy({
                where: {
                    id
                }
            });
            console.log("Data deleted at row " + id);
            fs.unlink(`./public${isFound.thumbnail}`, (err => {
                if (err) {
                    console.log("Failed to delete local File");
                }
            }))
            res.status(200).json(
                baseResponse(
                    200,
                    `Data deleted at row ${id}`,
                    null
                )
            )
        }
    } catch (e) {
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,
                e.toString()
            )
        );
    }
}

exports.findProductByCategory = async (req, res) => {
    let id = req.query.category_id
    try{
        const data = await productModel.findAll({
            where : {
                category_id : id
            }
        });
        return res.status(200).json(
            baseResponse(
                200,
                data == null ? constantResp.notFoundResult : constantResp.foundResult, 
                data
            )
        );
    }catch(e){
        return res.status(500).json(
            errorResponse(
                500,
                constantResp.internalServerError,
                e.toString()
            )
        );
    }
}
