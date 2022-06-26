const Sequelize = require('sequelize');
const connection = require('../config').Sequelize;

const productTable = connection.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : Sequelize.STRING,
    thumbnail : Sequelize.STRING,
    subtitle : Sequelize.STRING,
    instruction_text : Sequelize.STRING,
    slug : Sequelize.STRING,
    created_at : Sequelize.DATE,
    updated_at : Sequelize.DATE,
    category_id : Sequelize.INTEGER,
    status : Sequelize.TINYINT
}, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'products'
});

module.exports = productTable;