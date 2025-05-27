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
/* ------------------------------- Lista os Colaboradores ↓ ------------------------ */

colaboradorRoute.get('/lista-colaborador', async (request, response) => {

    try{
        const listaColaboradores = await prisma.colaborador.findMany({
        where:{
            situacao: "ativo"
        },
        orderBy: {
            nome: 'asc'
        }
        })
         response.status(200).json(listaColaboradores) 
    }catch(err){
        response.status(500).json({message: 'Erro de conexão com servidor, tente novamente!!'})
    }
})
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
          response.status(201)/*-> Retorna o stados de Created  */.json(request.body)
    }catch(err){
        response.status(500).json({message: 'Erro de conexão com servidor, tente novamente!!'})
    }
})
/* ------------------------------------------------ X ------------------------------------------------------ */

/* -------------------------- Registrar Saída Colaborador ↓ ------------------------------------- */

colaboradorRoute.put('/saida-colaborador/:id', async (request, response) => {

    try {
        const saidaAtualizada = await prisma.horarios.update({
        where: {
            id: request.params.id
        },
        data: {
            saida: request.body.saida
        }
        });

        response.status(200).json(saidaAtualizada);
    } catch (error) {
        console.error("Erro ao registrar saída:", error);
        response.status(500).json({ message: 'Erro de conexão com servidor, tente novamente!!' });
    }
})

/* ------------------------------------------------ X ------------------------------------------------------ */

/* --------------------- Lista Registros (Entrada e Saida) dos Colaboradores ↓ --------------------------------- */

colaboradorRoute.get('/registros', async (req, res) => {
  try {
    const registros = await prisma.horarios.findMany({  
        where: {          //← Verifica se o colaborador está ativo
            colaborador: {
                situacao: "ativo"
            },
            saida: ""
        },
      include: {
        colaborador: {
          select: {  // ← incluí os dados de cadastro do colaborador 
            nome: true,
            cracha: true,
            departamento: true
          }
        }
      },
      orderBy: {
        entrada: 'desc' 
      }
    });

    res.status(200).json(registros);
  } catch (err) {
    console.error("Erro ao buscar registros:", err);
    res.status(500).json({ message: 'Erro ao buscar registros' });
  }
});

export default colaboradorRoute;