import express, { request, response } from 'express' // -> Biblioteca do express
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient() // -> Conexão com o prisma

const UsersRoutes = express.Router() //-> Router: função do Express para roteamento

const JWT_SECRET = process.env.JWT_SECRET //-> process é usado para acessar o arquivo .env

UsersRoutes.use(express.json()) //-> indica para o express que ele vai receber os dados via JSON


UsersRoutes.use(cors()) //-> Configura o backend para aceitar a requisição do frontend


/*----------------------- Cadastro de Usuario --------------------  */
UsersRoutes.post('/cadastro', async (request, response) => { //-> para usar await a função dece ser async

    try{ //-> é a condicional de verificação de execução (tentar), caso de erro cai no catch

        const user = request.body //-> variavel para requisição

        const salt = await bcrypt.genSalt(10) //-> Variavel do Bcryp para definir o pesso da incriptação

        const hashPassword = await bcrypt.hash(user.password, salt) //-> pega a senha e gera o hash

        const userDB =  await prisma.users.create({
    
            data:{
              name:  user.name,
              user:  user.user,
              email:  user.email,
              password: hashPassword,
              acessos:  user.acessos
            },
        })
        response.status(201).json(userDB)

    }catch(err){

        response.status(500).json({message: 'Erro no servidor, tente novamente!'})

    }

})

/*-------------------------------- Fim Cadastro Usuario -------------------------------- */

/*----------------------- Função para listar os usuarios cadastrados --------------------------- */

UsersRoutes.get('/usuarios', async (request, response) => {

    const usuarios = await prisma.users.findMany({
        omit: {password: true}
    })

    response.status(200).json({message: 'Usuarios Listados com Sucesso!', usuarios}) // -> retorna a requisição /*-> 200 responde o status da requisição para o usuario */

})  //GET -> metodo usado para exibir/listar 

/*-------------------------------------- X ------------------------------------------- */

export default UsersRoutes
