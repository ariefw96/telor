const Sequelize = require('sequelize');
const connection = require('../config').Sequelize;

const categoryTable = connection.define('categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : Sequelize.STRING
}, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'categories'
});

module.exports = categoryTable;