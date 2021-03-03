import { ClientId } from './types'

export interface TickMessage {
    type: 'WEBSOCKET_MESSAGE_TICK'
    payload: {
        position: number
        localTime: number
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

export interface TimeDiffQueryMessage {
    type: 'WEBSOCKET_MESSAGE_TIME_DIFF_QUERY'
    payload: {
        leaderTimestamp: number
    }
}

export interface TimeDiffResponseMessage {
    type: 'WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE'
    payload: {
        leaderTimestamp: number
        followerTimestamp: number
    }
}

export interface FollowerConnectedMessage {
    type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED'
    payload: {
        timeDiff: number
    }
}

export type Message =
    | TickMessage
    | TimeDiffQueryMessage
    | TimeDiffResponseMessage
    | FollowerConnectedMessage
    | FollowerConnectMessage
    | LeaderConnectMessage

export const packMeta = (
    recipientId: ClientId,
    messageType: Message['type'],
    messageStr: string
) => {
    if (recipientId.indexOf('|') !== -1) {
        throw new Error(`client id with unvalid characters ${recipientId}`)
    }
    if (messageType.indexOf('|') !== -1) {
        throw new Error(`message type with unvalid characters ${messageType}`)
    }
    return `${recipientId}|${messageType}|${messageStr}`
}

export const unpackMeta = (
    messageStrWithMeta: string
): [ClientId, Message['type'], string] =>
    messageStrWithMeta.split('|', 3) as [ClientId, Message['type'], string]
