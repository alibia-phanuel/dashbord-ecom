import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import {sequelize} from "../config/database";

// 👇 Interface des attributs
interface UserClientAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  verifyOtp?: string;
  verifyOtpExpireAt?: number;
  isAccountVerified?: boolean;
  resetOtp?: string;
  resetOtpExpireAt?: string;
  role?: "admin" | "employer" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}

// 👇 Attributs optionnels à la création
interface UserClientCreationAttributes
  extends Optional<
    UserClientAttributes,
    | "id"
    | "verifyOtp"
    | "verifyOtpExpireAt"
    | "isAccountVerified"
    | "resetOtp"
    | "resetOtpExpireAt"
    | "role"
  > {}

class Userclient
  extends Model<UserClientAttributes, UserClientCreationAttributes>
  implements UserClientAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public verifyOtp!: string;
  public verifyOtpExpireAt!: number;
  public isAccountVerified!: boolean;
  public resetOtp!: string;
  public resetOtpExpireAt!: string;
  public role!: "admin" | "employer" | "user";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Userclient.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verifyOtp: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    verifyOtpExpireAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    isAccountVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetOtp: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    resetOtpExpireAt: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    role: {
      type: DataTypes.ENUM("admin", "employer", "user"),
      defaultValue: "user",
    },
  },
  {
    sequelize,
    tableName: "user_client",
    modelName: "UserClient",
  }
);

export default Userclient;
