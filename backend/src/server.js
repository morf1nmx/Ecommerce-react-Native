import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// ✅ ENDPOINT DE INNGEST (IMPORTANTE: debe estar ANTES de las rutas catch-all)
app.post("/api/inngest", serve({ 
    client: inngest, 
    functions,
    // Opcional: habilitar logging
    logLevel: "info"
}));

// Rutas API
app.get("/api/ecommerce", (req, res) => {
    res.status(200).json({ message: "Success" });
});

// Servir archivos estáticos en producción
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    // ⚠️ IMPORTANTE: Esta ruta catch-all debe ser LA ÚLTIMA
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin/dist", "index.html"));
    });
}

// Iniciar servidor
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${ENV.PORT}`);
            console.log(`📡 Endpoint Inngest: http://localhost:${ENV.PORT}/api/inngest`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();