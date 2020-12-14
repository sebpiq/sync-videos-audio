import {ClientId} from './types'

export interface TickMessage {
    type: 'WEBSOCKET_MESSAGE_TICK'
    payload: {
        currentTime: number
    }
}

export interface FollowerConnectMessage {
    type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT'
    payload: {
        clientId: ClientId
    }
}

export interface LeaderConnectMessage {
    type: 'WEBSOCKET_MESSAGE_LEADER_CONNECT'
    payload: {}
}

export interface LagQueryMessage {
    type: 'WEBSOCKET_MESSAGE_LAG_QUERY'
    payload: {
        leaderTimestamp: number
    }
}

export interface LagResponseMessage {
    type: 'WEBSOCKET_MESSAGE_LAG_RESPONSE'
    payload: {
        leaderTimestamp: number
        followerTimestamp: number
    }
}

export interface FollowerConnectedMessage {
    type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED'
    payload: {
        lagTime: number
    }
}

export type Message = TickMessage | LagQueryMessage | LagResponseMessage | FollowerConnectedMessage | FollowerConnectMessage | LeaderConnectMessage

export const packMeta = (recipientId: ClientId, messageType: Message["type"], messageStr: string) => {
    if (recipientId.indexOf('|') !== -1) {
        throw new Error(`client id with unvalid characters ${recipientId}`)
    }
    if (messageType.indexOf('|') !== -1) {
        throw new Error(`message type with unvalid characters ${messageType}`)
    }
    return `${recipientId}|${messageType}|${messageStr}`
}

export const unpackMeta = (messageStrWithMeta: string): [ClientId, Message["type"], string] =>
    messageStrWithMeta.split('|', 3) as [ClientId, Message["type"], string]