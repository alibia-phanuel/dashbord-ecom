import { sequelize } from '../config/database';
import { Product } from './product.model';
import { ProductImage } from './productImage.model';
import { Category } from './category.model';
import  Userclient  from './userClient.model';

// Product appartient à Category (1 catégorie peut avoir plusieurs produits)
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });


// Product a plusieurs images
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

export { sequelize, Product, ProductImage, Category, Userclient };
