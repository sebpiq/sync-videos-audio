import { ClientId, Snapshot } from './types'

export const TYPE_WEBSOCKET_MESSAGE_TICK = 'WEBSOCKET_MESSAGE_TICK'
export const TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECT = 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT'
export const TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT = 'WEBSOCKET_MESSAGE_LEADER_CONNECT'
export const TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_QUERY = 'WEBSOCKET_MESSAGE_TIME_DIFF_QUERY'
export const TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE = 'WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE'
export const TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED = 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED'

export interface TickMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_TICK
    payload: Snapshot
}

export interface FollowerConnectMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECT
    payload: {
        clientId: ClientId
    }
}

export interface LeaderConnectMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT
    payload: {}
}

export interface TimeDiffQueryMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_QUERY
    payload: {
        leaderTimestamp: number
    }
}

export interface TimeDiffResponseMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE
    payload: {
        leaderTimestamp: number
        followerTimestamp: number
    }
}

export interface FollowerConnectedMessage {
    type: typeof TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED
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
