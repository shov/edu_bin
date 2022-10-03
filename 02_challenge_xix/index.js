// const http = require('http')
// const {Pool} = require('pg')
// // DB
// const pool = new Pool({
//   user: 'default',
//   host: 'postgres',
//   database: 'default',
//   password: 'secret',
//   port: 5432,
// })
//
// pool.on('error', e => {
//   console.error('PG: ' + e.message, e)
//   process.exit(-1)
// })
//
// // HTTP
// const server = http.createServer(async (req, res) => {
//   console.log(req.url)
//   const client = await pool.connect()
//   try {
//     const result = await client.query('SELECT NOW()')
//     console.log('DB RESPONSE:', result.rows, (result?.rows || [])[0])
//   } catch (e) {
//     console.error('DB: ' + e.message, e)
//   } finally {
//     client.release()
//   }
// })
//
// server.on('error', e => {
//   console.error(e.message)
// })
//
// server.listen(8080, () => {
//   console.info('Listening on 8080...')
// })

'use strict'

const path = require('path')

global.ROOT_PATH = path.resolve(__dirname)
global.APP_PATH = path.resolve(ROOT_PATH, 'app')

process.env.PORT ??= '8080' // default

const Container = require('./infrastructure/Container')
const Logger = require('./infrastructure/Logger')
const Bus = require('./infrastructure/Bus')
const App = require('./infrastructure/App')

// TODO add a signal handler, for before exit, unhandled rejections, exceptions, kill

const container = new Container()

container.register('container', container).instance()
container.register('logger', Logger).singleton()
container.register('bus', Bus).singleton()
container.register('app', App)
  .dependencies('logger', 'bus', 'container')
  .singleton()

/**
 * @type {App}
 */
const app = container.get('app')

app.boot().init().start()
