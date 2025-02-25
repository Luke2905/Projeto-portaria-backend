import express, { request, response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient() // -> Instância do Prisma client para conexão com o banco de dados

const transpRoute = express.Router() //-> variavel para usar o express

transpRoute.use(express.json()) //-> indica para o express que ele vai receber os dados via JSON


transpRoute.use(cors()) //-> Configura o backend para aceitar a requisição do frontend


/*--------------------- Função para inserir dados no Banco de dados ------------------------- */

transpRoute.post('/cad-transportadoras', async (request, response) =>{

    try{
      const NovaTrasnportadora =  await prisma.transportadora.create(
            {
            data:{
    
                transportadora: request.body.transportadora,   //-> O resquest requisita uma informação
                motorista: request.body.motorista,
                rg_motorista: request.body.rg_motorista,
                ajudante: request.body.ajudante,
                rg_ajudante: request.body.rg_ajudante,
                placa: request.body.placa,
                dth_entrada: request.body.dth_entrada,
                dth_saida: request.body.dth_saida,
                empresa: request.body.empresa,
                tipo: request.body.tipo
                }
            }
        )//-> inseri os dados no banco de dados

        if (!NovaTrasnportadora) {
            console.log("Nenhuma nova transportadora foi cadastrada.");
        } else {
            console.log(`Nova transportadora: ${NovaTrasnportadora.transportadora}`);
        }
    
        response.status(201)/*-> Retorna o stados de Created  */.json(request.body)
    }catch(err){
        response.status(500).json({message: 'Erro no sercidor, tente novamente'})
    }

}) //-> Variavel para criar o cadastro de uma transportadora (Usasse o metodo POST)

/*---------------------------------------Fim função POST ---------------------------------------- */


/*------------------------------------ Função para alterar os dados do Banco de dados ------------------------- */

transpRoute.put('/edit-transportadoras/:id', async (request, response) =>{

    await prisma.transportadora.update({
        where:{
            id: request.params.id
        },
            data:{
    
            dth_saida: request.body.dth_saida //-> O resquest requisita uma informação
    
             }
         }
        )//-> altera os dados já cadastrados no banco de dados por meio do metodo PUT
    
        response.status(200)/*-> Retorna o stados de Created  */.json(request.body)
    
    })
/*---------------------------------------Fim função PUT---------------------------------------- */

/*------------------------------ Função para excluir os Dados ----------------------------------*/

transpRoute.delete('/delete-transportadoras/:id', async (request, response) =>{ // -> rota para deletar uma infotmação do banco de dados

    await prisma.transportadora.delete({
        where: {
            id: request.params.id  
        }
    })

    response.status(200).json({message: 'Transportadora deletada com sucesso!'})

})

/*--------------------------------------- Fim da função DELETE-------------------------------- */
/*----------------------- Função para listar os dados cadastrados --------------------------- */

transpRoute.get('/transportadoras', async (request, response) => {

    const transportadoras = await prisma.transportadora.findMany({
        where: {
            dth_saida: ""  //-> retorna apenas as transportadora sem data de saida registrada
        },
        orderBy: {
            dth_entrada: 'asc'  // -> Ordena pela data de entrada em ordem crescente
         }
    })

    response.status(200).json(transportadoras) // -> retorna a requisição /*-> 200 responde o status da requisição para o usuario */

})  //GET -> metodo usado para exibir/listar 

/*-------------------------------------- X ------------------------------------------- */


/*-------------------------------------- Alerta de Nova Transportadora ----------------------*/
transpRoute.get('/novatransportadora', async (request, response) => {
    const date = new Date();
    date.setSeconds(0, 0);  // Ignora os segundos e milissegundos da data atual
    const dateFormatted = date.toISOString().split('Z')[0];  // Formata a data sem 'Z'

    try {
        const transportadora = await prisma.transportadora.findFirst({
            orderBy: {
                dth_entrada: 'desc'
            }
        });

        // Remove os segundos e milissegundos da data da API
        if (transportadora && transportadora.dth_entrada) {
            const transportadoraDate = new Date(transportadora.dth_entrada);
            transportadoraDate.setSeconds(0, 0);  // Ignora os segundos e milissegundos da data da API

            // Compara as datas sem considerar os segundos
            if (transportadoraDate.toISOString().split('Z')[0] === dateFormatted) {
                response.status(200).json({ message: `Nova transportadora no Pátio: ${transportadora.transportadora}` });
            } else {
                response.status(404).json({ message: 'Nenhuma transportadora encontrada.' });
            }
        } else {
            response.status(404).json({ message: 'Nenhuma transportadora encontrada.' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Erro ao buscar transportadora.' });
    }
});
/*-------------------------------------- X ------------------------------------------- */

/*----------------------- Função para Relatório de Transportadoras --------------------------- */

transpRoute.get('/reportstransportadora', async (request, response) => {

    try{
        const transportadoraReport = await prisma.transportadora.findMany({
            where: {
                dth_saida: {
                    not: "" // -> Retorna transportadoras COM data de saída registrada
                }
            },
            orderBy: {
                dth_entrada: 'asc'  // -> Ordena pela data de entrada em ordem crescente
             }
        })
    
        response.status(200).json(transportadoraReport) // -> retorna a requisição /*-> 200 responde o status da requisição para o usuario */
    }catch(err){
        response.status(500).json({ message: 'Erro ao buscar transportadora.' });
    }

})  //GET -> metodo usado para exibir/listar 

/*-------------------------------------- X ------------------------------------------- */

export default transpRoute


/*langflow*/