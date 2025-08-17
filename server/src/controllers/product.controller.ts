import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { ProductImage } from "../models/productImage.model";

// Lister tous les produits avec leurs images et catégorie
// Lister tous les produits
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
    res.json({ data: products }); // 👈 wrap dans { data }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Obtenir un produit par ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category" },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.json({ data: product }); // 👈 wrap dans { data }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer un produit
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const product = await Product.create({ name, description, price, stock, categoryId });

    const productWithCategory = await Product.findByPk(product.id, {
      include: { model: Category, as: "category", attributes: ["name"] },
    });

    res.status(201).json({ data: productWithCategory }); // 👈 wrap
  } catch (error) {
    res.status(400).json({ message: "Données invalides", error });
  }
};

// Modifier un produit
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }

    await product.update({ name, description, price, stock, categoryId });

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ association: "category" }],
    });

    res.json({ data: updatedProduct }); // 👈 wrap
  } catch (error) {
    res.status(400).json({ message: "Erreur mise à jour", error });
  }
};

// Supprimer un produit
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }

    await ProductImage.destroy({ where: { productId: product.id } });
    await product.destroy();

    res.json({ message: "Produit supprimé" }); // ici pas besoin de data
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error });
  }
};