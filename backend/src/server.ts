import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { corsConfig } from "./config/cors"
import { connectDB } from "./config/db"
import authRoutes from "./routes/authRoutes"
import projectRoutes from "./routes/projectRoutes"

// Load environment variables from .env file
dotenv.config()

connectDB()

// Create an Express application
const app = express()

// Set the port to listen on
app.use(cors(corsConfig))

// Logging middleware for development
app.use(morgan('dev'))

// Allow JSON in req.body
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

export default app