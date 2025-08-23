"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productImage_controller_1 = require("../controllers/productImage.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Ajouter plusieurs images à un produit
router.post('/:id/images', upload_middleware_1.upload.array('images', 5), productImage_controller_1.addImages);
// Lister les images d’un produit
router.get('/:id/images', productImage_controller_1.getImages);
// Supprimer une image d’un produit
router.delete('/:id/images/:imgId', productImage_controller_1.deleteImage);
exports.default = router;
