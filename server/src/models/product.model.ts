import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Product extends Model {
  public id!: number; // Le point d'exclamation indique que la valeur sera définie
  public name!: string;
  public description?: string; // Optionnel
  public price!: number;
  public stock!: number;
  public categoryId!: bigint;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
} // Modèle Product

Product.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT, // Description non obligatoire
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Categories", // ou Category si tu veux que Sequelize gère automatiquement
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize, // Instance Sequelize
    modelName: "Product", // Nom du modèle
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);
