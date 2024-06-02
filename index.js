import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js'
import UsersRouter from './routes/userRoutes.js'
import LinksRouter from './routes/linkRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
const port = process.env.PORT||3000

app.use(cors())
app.use(express.json())
app.use('/users', UsersRouter)
app.use('/links',LinksRouter)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
