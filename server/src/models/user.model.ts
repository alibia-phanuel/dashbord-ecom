import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: string;
  public uuid!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "employe" | "client";
  public createdBy!: string | null;
  public profilePicture!: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "employe", "client"),
      allowNull: false,
      validate: {
        isIn: [["admin", "employe", "client"]],
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
