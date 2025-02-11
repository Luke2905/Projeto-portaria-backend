import express from 'express'
import transpRoute from './routes/TransportadorasRoutes.js' //-> importa as rotas de transportadoras
import PublicRoutes from './routes/public.js' //-> importa o arquivo de rotas publicas




const app = express() //-> variavel para usar o express

app.use('/', PublicRoutes) // -> Rotas Publicas

app.use('/', transpRoute) //-> Rotas de transportadoras



app.listen(4000) //-> porta que ele vai rodar




/*
    Conexão MONGODB:

    user: lucas
    senha: LucasTI2025
*/
