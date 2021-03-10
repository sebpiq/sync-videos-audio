export type ClientId = string

export enum MediaStatus {
    PLAYING,
    NOT_PLAYING,
}

export interface Snapshot {
    mediaStatus: MediaStatus

    // Position on the media in milliseconds
    position: number

    // Local timestamp at which `position` was recorded
    timestamp: number
}