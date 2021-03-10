import WebSocket from 'ws'
import Koa from 'koa'
import koaStatic from 'koa-static'
import http from 'http'
import state from './state'
import config from './config'
import pEvent from 'p-event'
import { FollowerConnectMessage, TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECT, TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT, unpackMeta } from './shared/websocket-messages'
import { BROADCAST_ID, LEADER_ID, SERVER_ID } from './shared/constants'

const createWebSocketServer = async () => {
    const clientIds: { [clientId: string]: WebSocket } = {}
    const webSocketServer = new WebSocket.Server({
        server: state.get().httpServer,
    })
    webSocketServer.on('connection', (client) => {
        client.on('message', (messageStrWithMeta: string) => {
            console.log(messageStrWithMeta)
            const [recipientId, messageType, messageStr] = unpackMeta(
                messageStrWithMeta
            )

            // Save the client with its id in the map
            switch (messageType) {
                case TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECT:
                    const message: FollowerConnectMessage = JSON.parse(
                        messageStr
                    )
                    clientIds[message.payload.clientId] = client
                    break
                case TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT:
                    clientIds[LEADER_ID] = client
                    break
            }

            // Proxy the message to the right client
            switch (recipientId) {
                case BROADCAST_ID:
                    webSocketServer.clients.forEach((otherWebSocket) =>
                        otherWebSocket.send(messageStrWithMeta)
                    )
                    break
                case SERVER_ID:
                    break
                default:
                    const recipient = clientIds[recipientId]
                    if (!recipient) {
                        console.error(`unknown id ${recipientId}`)
                        break
                    }
                    recipient.send(messageStrWithMeta)
            }
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

main()
    .then(() => {
        console.log(`server running on port ${config.SERVER_PORT}`)
        console.log(`Serving static content from ${config.ROOT_DIR}`)
    })
    .catch((error) => {
        console.error(`server failed starting`)
        console.error(error)
        process.exit(1)
    })
