const http = require('http')

const memoryStorage = { redSet: new Set() }

const server = http.createServer((req, res) => {
  // extract url path
  const method = req.method.toLowerCase()

  console.log(method, req.url)

  let body = void 0
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })

  // od data is received
  req.on('end', () => {
    if (req.headers['content-type'] === 'application/json') {
      try {
        body = JSON.parse(data)
      }
      catch (e) {
        res.writeHead(400).end('Invalid JSON')
        return
      }
    }
    else {
      body = data
    }

    dispatch(method, req.url, body, res)
  })
})

server.listen(3000, () => {
  console.log('server is running on port 3000')
})

const routerList = [
  {
    method: 'get',
    url: '/get-red',
    handler: getRed,
  },
  {
    method: 'post',
    url: '/set-red',
    handler: setRed,
  }
]

function dispatch(method, url, body, res) {
  const action = routerList.find(action => action.method === method && action.url === url)
  if (!action) {
    res.writeHead(404).end('Not Found')
  }

  action.handler(body, res)
}

function setRed(body, res) {
  if (!body?.redDayList || !Array.isArray(body.redDayList)) {
    res.writeHead(400).end('Invalid redDayList')
    return
  }

  body.redDayList.forEach(day => {
    memoryStorage.redSet.add(day)
  })

  res.writeHead(200).end('ok')
}

/**
 * @param {*} body 
 * @param {Response} res 
 */
function getRed(body, res) {
  res.writeHead(200,
    {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  ).end(JSON.stringify({ redDayList: [...memoryStorage.redSet] }))
}