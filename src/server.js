import express from 'express'
import cartRoutes from './routes/cartRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express();

app.use(express.json())
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler)

const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})