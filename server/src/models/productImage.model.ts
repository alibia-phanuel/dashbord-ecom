import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ProductImage extends Model {
  public id!: number;
  public productId!: number;
  public imageUrl!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
} // Modèle Image

ProductImage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false, // L'image doit obligatoirement appartenir à un produit
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false, // Chemin ou URL de l’image
    },
  },
  {
    sequelize, // Instance Sequelize
    modelName: "ProductImage", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);
