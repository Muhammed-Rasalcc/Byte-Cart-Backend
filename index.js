const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const port = process.env.port || 5000

//middlewire setting
app.use(express.json({limit: "25mb"}));
app.use(express.urlencoded({limit: "25mb"}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//image upload
const UploadImage =require('./src/utils/uploadImage')

//all routes
const authRoutes = require('./src/users/user.route')
const productRoutes = require('./src/products/products.route')
const reviewsRoutes = require('./src/reviews/reviews.router')
const orderRoutes = require('./src/orders/orders.route')
const statsRoutes= require('./src/stats/stats.route');
const uploadImage = require('./src/utils/uploadImage');

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stats', statsRoutes)


 main().then(() => console.log("mongodb is sucessfully connected")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URl);

    
    app.get('/', (req, res) => {
        res.send('Byte-Cart sever is running ....')
    })
}

app.post('/uploadImage', (req ,res)=>{
    uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})