"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Userclient extends sequelize_1.Model {
}
Userclient.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    verifyOtp: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    verifyOtpExpireAt: {
        type: sequelize_1.DataTypes.BIGINT,
        defaultValue: 0,
    },
    isAccountVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    resetOtp: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    resetOtpExpireAt: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "employer", "user"),
        defaultValue: "user",
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "user_client",
    modelName: "UserClient",
});
exports.default = Userclient;
