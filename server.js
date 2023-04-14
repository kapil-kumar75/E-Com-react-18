import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/CategoryRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

// middleware start
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
dotenv.config()

// middleware end

// database connect
connectDB()

// all routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server is running in ${process.env.DEV_MODE} on port ${port}`)
})
