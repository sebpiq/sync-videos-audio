export interface TickMessage {
    type: 'tick'
    payload: {
        currentTime: number
    }
}

export type Message = TickMessage