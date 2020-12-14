export interface TickMessage {
    type: 'WEBSOCKET_MESSAGE_TICK'
    payload: {
        currentTime: number
    }
}

export interface FollowerConnectMessage {
    type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT'
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

export type Message = TickMessage | LagQueryMessage | LagResponseMessage | FollowerConnectedMessage | FollowerConnectMessage