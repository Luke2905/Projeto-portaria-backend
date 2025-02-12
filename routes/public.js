import express, { request, response } from 'express' // -> Biblioteca do express
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient() // -> Conexão com o prisma

const PublicRoutes = express.Router() //-> Router: função do Express para roteamento

const JWT_SECRET = process.env.JWT_SECRET //-> process é usado para acessar o arquivo .env

PublicRoutes.use(express.json()) //-> indica para o express que ele vai receber os dados via JSON


PublicRoutes.use(cors()) //-> Configura o backend para aceitar a requisição do frontend


/*----------------------- Cadastro de Usuario --------------------  */
PublicRoutes.post('/cadastro', async (request, response) => { //-> para usar await a função dece ser async

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

/* ----------------------------------- Login ----------------------------------- */
PublicRoutes.post('/login', async (request, response) => {

    try{

        const userInfo = request.body

        //busca apenas um registro no banco de dados
        const user = await prisma.users.findUnique(
            {
                where: {email: userInfo.email}, //-> procurando o usuario pelo user
            }
        ) 

        // Verifica se existe o registro  do usuario no banco de dados
        if(!user){
            return response.status(404).json({message: 'Usuario não encontardo'}) //-> usuario não seja encontrado
        }

        const isMatch = await bcrypt.compare(userInfo.password, user.password) //-> metodo do Bcrypt para comparar o hash com a senha e desincriptar ela


        //Verifica se a senha digitada é igual a senha do banco de dados
        if(!isMatch){
            return response.status(400).json({message: 'Senha Invalida'})
        }

        // Gera o Token JWT

        const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '1m'}) //-> gera o Token de acesso e determina o tempo para expirar atraves o expiresIn

        response.status(200).json(token)
    }catch(err){

        response.status(500).json({message: 'Erro no servidor, tente novamente!'})

    }


})
/*-------------------------------------- FIM LOGIN ----------------------------- */
/*----------------------- Função para listar os usuarios cadastrados --------------------------- */

PublicRoutes.get('/usuarios', async (request, response) => {

    const usuarios = await prisma.users.findMany()

    response.status(200).json(usuarios) // -> retorna a requisição /*-> 200 responde o status da requisição para o usuario */

})  //GET -> metodo usado para exibir/listar 

/*-------------------------------------- X ------------------------------------------- */

export default PublicRoutes
