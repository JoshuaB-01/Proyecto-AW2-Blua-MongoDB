import { connectToDatabase } from "../connection.js"
import Product from "../schemas/product.schema.js"

export const createProd = async({nombre, desc, precio, imagen, stock, disponible, categoria})=>{
    try{
        await connectToDatabase()
        const res = await Product.create({nombre, desc, precio, imagen, stock, disponible, categoria})
        
        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}

export const getAllProducts = async () => {
    try {
        await connectToDatabase()
        const products = await Product.find({})
        
        return JSON.parse(JSON.stringify(products))
    } catch(error) {
        console.log(error)
        throw error
    }
}