const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;
const URI = process.env.URI;

const body_parser = require('body-parser');
app.use(body_parser.json());

const mongoose = require('mongoose');
mongoose.connect(URI)
    .then(() => console.log(`Mongodb connected successfully!`))
    .catch(err => console.error('MongoDB connection error:', err));


const productSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true // Add this if the title is mandatory
    },
    price: {
        type: Number, // Change this to Number if you want to store prices as numerical values
        required: true // Add this if the price is mandatory
    }
});
  
const Product = mongoose.model('Product', productSchema);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/products', async (req, res) => {
    const {image, title, price} = req.body;
    if(!image || !title || !price) {
        return res.status(400).json({message: "image, Title and Price are required"})
    };

    const product = await new Product({image, title, price});
    product.save();

    res.status(201).json({message: "Product added cusseccfully!"});
});

app.get('/products', async (req, res) => {
    const products = await Product.find();
    if(products.length == 0) {
        
        return res.status(404).json({message: "There are no product"})
    }
    res.status(200).json({products});
});


app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});