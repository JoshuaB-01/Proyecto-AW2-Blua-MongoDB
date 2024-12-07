import { connectToDatabase } from "../connection.js"
import Product from "../schemas/product.schema.js"
import { Review } from "../schemas/review.schema.js"

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
        
        const productsWithReviews = await Promise.all(products.map(async (product) => {
            const reviews = await Review.find({ producto: product._id })
            const avgRating = reviews.length > 0 
                ? reviews.reduce((sum, review) => sum + review.calificacion, 0) / reviews.length 
                : 0
            
            return {
                ...product.toObject(),
                calificacionPromedio: avgRating
            }
        }))
        
        return JSON.parse(JSON.stringify(productsWithReviews))
    } catch(error) {
        console.log(error)
        throw error
    }
}