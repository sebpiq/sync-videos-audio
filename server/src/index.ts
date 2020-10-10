import WebSocket from 'ws'
import Koa from 'koa'
import koaStatic from 'koa-static'
import http from 'http'
import state from './state'
import config from './config'
import pEvent from 'p-event'

const createWebSocketServer = async () => {
    const webSocketServer = new WebSocket.Server({ server: state.get().httpServer })
    webSocketServer.on('connection', (webSocket) =>  {
        webSocket.on('message', (messageStr: string) => {
            webSocketServer.clients.forEach((otherWebSocket) => otherWebSocket.send(messageStr))
        })
    })
    return webSocketServer
}

const createHttpServer = async () => {
    const server = http.createServer(state.get().koaApp.callback())
    return server
}

const startHttpServer = async () => {
    state.get().httpServer.listen(config.SERVER_PORT)
    await pEvent(state.get().httpServer, 'listening')
}

const createKoaApp = async () => {
    const koaApp = new Koa()
    koaApp.use(koaStatic(config.ROOT_DIR))
    return koaApp
}

const main = async () => {
    state.set({ koaApp: await createKoaApp() })
    state.set({ httpServer: await createHttpServer() })
    state.set({ webSocketServer: await createWebSocketServer() })
    return startHttpServer()   
}

main().then(() => {
    console.log(`server running on port ${config.SERVER_PORT}`)
    console.log(`Serving static content from ${config.ROOT_DIR}`)
}).catch((error) => {
    console.error(`server failed starting`)
    console.error(error)
    process.exit(1)
})