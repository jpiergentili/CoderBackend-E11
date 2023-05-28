import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import cartsRouter from './routes/carts.router.js'
import cartRouter from './routes/cart.router.js'
import sessionRouter from './routes/session.router.js'
import session from 'express-session'
import MongoStore from 'connect-mongo' 


const uri = 'mongodb+srv://javypier1:Q1w2e3r4@jp-backend-coder01.bavi18s.mongodb.net/'

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Grabación de las sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: 'entrega11backend'
    }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))
app.use('/sessions', sessionRouter)


//configuracion del motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

//configuracion de la carpeta publica
app.use(express.static('./src/public'))

app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter);
app.use('/carts', cartRouter);


mongoose.set('strictQuery', false)

//Conexión a la DB
try{
    await mongoose.connect(uri, {
        dbName: 'entrega11backend'
    })
    console.log('DB connected!')
    
} catch (error) {
    console.log("No se pudo conectar con la base de datos!!");
}

app.listen(8080, () => console.log('Server UP'))