import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { Server } from "socket.io";
import { SocketController } from './SocketController';
import { TextProcessor } from './TextProcessor';

dotenv.config()

const PORT = process.env.PORT || 3000
const PORT_WS = process.env.PORT_WS || 3001

// Arrange business logic 
const textProcessor = new TextProcessor()

// Setup express HTTP
{
  const app = express()

  app.use(cors())
  app.use(express.json())

  // stub
  app.get('/api/plain-text', (req, res) => {
    res.status(200).json({
      plainText: `Ipsum Lorem
  dolor sit amet consectetur adipisicing elit. Ipdo rum, lionem, percipit 
  Consequuntur, quibusdam. 
  Quisquam, voluptatibus. Quisquam, voluptatibus.
` })
  })

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

// Setup Soket IO
{
  const io = new Server({
    cors: {
      origin: '*',
    }
  });

  const socketController = new SocketController(textProcessor);

  io.on("connection", socketController.handleConnection.bind(socketController));

  io.listen(Number(PORT_WS));
}