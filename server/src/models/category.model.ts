import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Category extends Model {
  public id!: number;
  public name!: string;



  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
} // Création du modèle Category

Category.init(
  {
    id: {
      type: DataTypes.BIGINT, 
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Le nom est obligatoire
    },
  },
  {
    sequelize, // Instance Sequelize
    modelName: "Category", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);
