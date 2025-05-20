import express, {request, response} from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient();

const colaboradorRoute = express.Router();

colaboradorRoute.use(express.json()) 


colaboradorRoute.use(cors())

/* -------------------- Configurações Rota ↑ ------------------------------ */

/* ---------------------- Rota de Cadastro de Colaborador ↓ --------------- */
colaboradorRoute.post('/cad-colaborador', async (request, response) => {

    try{
        const NovoColaborador = await prisma.colaborador.create(
        {
            data:{
                nome: request.body.nome,
                cracha: request.body.cracha,
                departamento: request.body.departamento
            }
        }
        
    )

        if (!NovoColaborador) {
            console.log("Nenhum Colaborador foi cadastrado.");
        } else {
            console.log(`Novo colaborador: ${NovoColaborador.nome}`);
        }
    
        response.status(201)/*-> Retorna o stados de Created  */.json(request.body)
    }catch(err){
        response.status(500).json({message: 'Erro no servidor, tente novamente'})
    }
})

/*------------------------------------ X ---------------------------------------- */
/*------------------------------ Registrar Entrada Colaborador ↓ -------------------- */

colaboradorRoute.post('/entrada-colaborador', async (request, response) => {

    try{
        const EntradaColaborador = await prisma.horarios.create({
            data: {
                colaboradorId: request.body.colaboradorId,
                entrada: request.body.entrada,
                saida: request.body.saida
            }
        })

        if (!EntradaColaborador) {
            console.log("Nenhum Colaborador foi cadastrado.");
        } else {
            console.log("Entrada Registrada");
        }

    }catch(err){
        response.status(500).json({message: 'Erro de conexão com servidor, tente novamente!!'})
    }
})

export default colaboradorRoute;