const categoryModel = require('../../model/category_model');
const { baseResponse, errorResponse } = require('../../utils/responseUtils');
const constantResp = require('../../utils/constantMessage');
const moment = require('moment');

exports.addCategory = async (req, res) => {
    try{
        let categories = {
            name : req.body.name
        }
        try{
            await categoryModel.create(categories);
            return res.status(200).json(
                baseResponse(
                    200,
                    constantResp.successCreateProduct,
                    categories
                )
            )
        }catch(sqlError){
            console.log("sqlError", sqlError);
            throw sqlError.toString();
        }
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

exports.listCategories = async (req, res) => {
    try{
        const data = await categoryModel.findAll();
        return res.status(200).json(
            baseResponse(
                200,
                data.length < 1 ? constantResp.notFoundResult : constantResp.foundResult,
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

