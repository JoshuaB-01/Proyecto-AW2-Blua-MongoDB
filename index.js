import express from 'express'
import usersRouter from './routes/users.routes.js'
import productsRouter from './routes/products.routes.js'
import ordersRouter from './routes/orders.routes.js'
import cors from 'cors'
import { encryptPasswords, encryptMongoPasswords } from './utils/encrypt.middleware.js'
import { verifyToken } from './utils/auth.middleware.js'
import reviewsRouter from './routes/reviews.routes.js'
import 'dotenv/config'

const app = express()
const port = process.env.PORT

await encryptMongoPasswords();

app.use(cors());
app.use(express.json())

app.use(express.static('./client'))

app.use('/users', encryptPasswords, usersRouter)
app.use('/products', productsRouter)
app.use('/reviews', reviewsRouter)
app.use('/orders', verifyToken, ordersRouter)

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})