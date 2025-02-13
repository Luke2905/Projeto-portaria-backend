import jwt from "jsonwebtoken" //-> importar a biblioteca do JWT
import express, { request, response } from "express"

const JWT_SECRET = process.env.JWT_SECRET

const auth = (request, response, next) => { //-> variaveis middleware alem do request e respose tambem tem o  next (o validador do token)

     
    const token =  request.headers.authorization //-> Localização do TOKEN


    if(!token){ //-> ! se o retorno for vazio

        return response.status(401).json({message: 'Usuario não autorixado'})
    }

    try{  //-> verificação do Token

        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)  // Verify é a propriedade do JWT para verificar o token e o replace é para ajustar o retorno de uma informação

        request.userId = decoded.id

    }catch(err){
        
        return response.status(401).json({message: 'Token Inválido'})
    }

    next()

}  

export default auth