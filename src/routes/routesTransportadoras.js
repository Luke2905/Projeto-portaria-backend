import express, { request, response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() // -> Instância do Prisma client para conexão com o banco de dados

const app = express() //-> variavel para usar o express

app.use(express.json()) //-> indica para o express que ele vai receber os dados via JSON



export async function RoutesTransportadoras(request, response){


/*--------------------- Função para inserir dados no Banco de dados ------------------------- */
    
app.post('/cad-transportadoras', async (request, response) =>{


    await prisma.transportadora.create(
         {
            data:{
    
            transportadora: request.body.transportadora,   //-> O resquest requisita uma informação
            motorista: request.body.motorista,
            dth_entrada: request.body.dth_entrada,
            empresa: request.body.empresa
    
             }
         }
        )//-> inseri os dados no banco de dados
    
        response.status(201)/*-> Retorna o stados de Created  */.json(request.body)
    
    }) //-> Variavel para criar o cadastro de uma transportadora (Usasse o metodo POST)
    
    /*---------------------------------------Fim função POST ---------------------------------------- */
    
    /*---------------------- Função para alterar os dados do Banco de dados ------------------------- */
    
    app.put('/edit-transportadoras/:id', async (request, response) =>{
    
        await prisma.transportadora.update({
            where:{
                id: request.params.id
            },
                data:{
        
                transportadora: request.body.transportadora,   //-> O resquest requisita uma informação
                motorista: request.body.motorista,
                dth_entrada: request.body.dth_entrada,
                empresa: request.body.empresa
        
                 }
             }
            )//-> altera os dados já cadastrados no banco de dados por meio do metodo PUT
        
            response.status(200)/*-> Retorna o stados de Created  */.json(request.body)
        
        })
    /*---------------------------------------Fim função PUT---------------------------------------- */
    
    /*------------------------------ Função para excluir os Dados ----------------------------------*/
    
    app.delete('/delete-transportadoras/:id', async (request, response) =>{ // -> rota para deletar uma infotmação do banco de dados
    
        await prisma.transportadora.delete({
            where: {
                id: request.params.id  
            }
        })
    
        response.status(200).json({message: 'Transportadora deletada com sucesso!'})
    
    })
    
    /*--------------------------------------- Fim da função DELETE-------------------------------- */
    
    /*----------------------------- Função para listar os dados cadastrados ---------------------- */
    
    app.get('/transportadoras', async (request, response) => {
    
        const transportadoras = await prisma.transportadora.findMany()
    
        response.status(200).json(transportadoras) // -> retorna a requisição /*-> 200 responde o status da requisição para o usuario */
    
    })  //GET -> metodo usado para exibir/listar 


    
}

