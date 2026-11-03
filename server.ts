import express  from 'express';
import 'dotenv/config'
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import hotelsRoutes from './routes/hotelsRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app= express()
app.use(express.json())
await connectDB()

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use("/auth", authRoutes)
app.use("/hotels", hotelsRoutes)
app.use("/hotels/:hotelId/rooms", roomRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log("Server is running on http://localhost:" + process.env.PORT)
})