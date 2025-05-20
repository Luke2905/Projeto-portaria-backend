import express from 'express'
import transpRoute from './routes/TransportadorasRoutes.js' //-> importa as rotas de transportadoras
import PublicRoutes from './routes/public.js' //-> importa o arquivo de rotas publicas
import UsersRoutes from './routes/UsuariosRoute.js' //-> importa a rota de usuarios
import colaboradorRoutes from './routes/ColaboradoresRoutes.js' //-> importa as rotas de colaboradores

import auth from './middlewares/auth.js' //-> autenticador de rotas




const app = express() //-> variavel para usar o express

app.use('/', PublicRoutes) // -> Rotas Publicas

app.use('/', transpRoute) //-> Rotas de transportadoras

app.use('/', colaboradorRoutes)

app.use('/', auth, UsersRoutes) // -> Rotas de gerenciamento de usuarios

app.listen(4000) //-> porta que ele vai rodar




/*
    Conexão MONGODB:

    user: lucas
    senha: LucasTI2025
*/
