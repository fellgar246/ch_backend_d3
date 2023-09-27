import * as fs from 'fs';

export default class ProductManager {
    constructor(){
        this.products = []
        this.path = './src/Managers/products.json';
    }

    getProducts = async() => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,'utf-8');
            const products = JSON.parse(data);
            return products
        }
        return [];
    }


    addProduct = async( title, description, price, thumbnail, code, stock ) => {
        try {
            if( !title || !description || !price || !thumbnail || !code || !stock ) throw new Error ("Todos los campos son obligatorios");

            const products = await this.getProducts();

            const productDuplicated = products.find( product => product.code === code )
            if(productDuplicated) throw new Error("Producto con código duplicado, ingrese uno nuevo por favor") ;       

            const product = {
                title: title, 
                description: description, 
                price: price, 
                thumbnail: thumbnail, 
                code: code,
                stock: stock
            }
            if(products.length === 0){
                product.id = 1
            } else{
                product.id = products[products.length-1].id+1;
            }
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'));
            return product
        } catch (error) {
            return error.message
        }
        
    }

    getProductById = async(id) => {
        try {
            const products = await this.getProducts();
            const product = products.find( product => product.id  === Number(id) )
            if(!product) throw new Error("Product not found");
            return product
        } catch (error) {
            return error.message
        }
       
    }

    updateProduct = async (id, updatedFields) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === id);
    
            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }
    
            const productToUpdate = { ...products[productIndex], ...updatedFields };
            
            if (updatedFields.code) {
                const duplicateCode = products.find(product => product.code === updatedFields.code);
                if (duplicateCode) {
                    throw new Error("Modificación de producto con código duplicado, ingrese otro código");
                }
            }
    
            products[productIndex] = productToUpdate;
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return productToUpdate;
        } catch (error) {
            return error.message;
        }
    }

    deleteProduct= async(id) => {
        try {

            const products = await this.getProducts();
            const product = products.find( product => product.id  === id )   
            if(!product) throw new Error("Not found");
            
            const productsFiltered = products.filter( product => product.id != id)
            
            await fs.promises.writeFile(this.path, JSON.stringify(productsFiltered,null,'\t'));
            return productsFiltered
        } catch (error) {
            return error.message
        }
    }

    
}

