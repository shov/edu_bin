import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { Server } from "socket.io";

import { EMessageName } from 'infrastructure_common'

dotenv.config()

const PORT = process.env.PORT || 3000
const PORT_WS = process.env.PORT_WS || 3001

const app = express()

app.use(cors())
app.use(express.json())

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

const io = new Server({
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket) => {

  setInterval(() => {
    socket.emit(EMessageName.TEXT_STATE, {
      plainText: `Ipsum Lorem`
    })
  }, 1000);
});

io.listen(Number(PORT_WS));