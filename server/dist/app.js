"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Import d'Express et des types Request et Response pour TypeScript
const dotenv_1 = __importDefault(require("dotenv"));
// Import du package dotenv pour gérer les variables d'environnement
const product_routes_1 = __importDefault(require("./routes/product.routes"));
// Import des routes produits définies dans product.routes.ts
const category_routes_1 = __importDefault(require("./routes/category.routes"));
// Import des routes catégories définies dans category.routes.ts
const productImage_routes_1 = __importDefault(require("./routes/productImage.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const authClient_routes_1 = __importDefault(require("./routes/authClient.routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Import du middleware CORS pour gérer les requêtes cross-origin
dotenv_1.default.config();
// Chargement des variables d'environnement depuis le fichier .env
const app = (0, express_1.default)();
// Création d'une instance de l'application Express
app.use(express_1.default.json());
// Middleware pour parser automatiquement le corps des requêtes au format JSON
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Déclaration des routes principales de l'API
app.use("/api/products", product_routes_1.default);
// Toute requête commençant par /api/products sera gérée par productRoutes
app.use("/api/categories", category_routes_1.default);
// Toute requête commençant par /api/categories sera gérée par categoryRoutes
app.use("/api/products", productImage_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/authClient", authClient_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Route simple pour vérifier que l'API fonctionne
app.get("/", (req, res) => {
    res.send("API en ligne 🚀");
});
// Middleware pour gérer les routes non définies (404 Not Found)
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée" });
});
exports.default = app;
// Export de l'application Express pour être utilisée ailleurs (par ex. dans server.ts)
