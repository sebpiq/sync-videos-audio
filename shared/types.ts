export type ClientId = string

export interface Snapshot {
    // Position on the media in milliseconds
    position: number

    // Local timestamp at which `position` was recorded
    timestamp: number
}