import express from 'express';
import ProductManager from './Managers/ProductManager.js';

const app = express();

app.get('/products', async (req, res) => {
    const {limit} = req.query;
   
    try {
        const products = new ProductManager();
        const allProducts = await products.getProducts()

        if(limit) {
            const limitProducts = [...allProducts.slice(0, limit)]
            res.status(200).json(limitProducts)
        } else{
            res.status(200).json(allProducts)
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.get('/products/:pid', async(req, res) => {
    const {pid} = req.params;
    
    try {
        const products = new ProductManager();
        const productById = await products.getProductById(pid);
        res.status(200).json(productById);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
  
})


const PORT = 8080 

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))