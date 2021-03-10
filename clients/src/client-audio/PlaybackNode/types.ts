import { MediaStatus } from "../../shared/types";

export interface PlaybackNodeMessageData {
    audioArrays?: Array<Float32Array>
    readPosition?: number
    status?: MediaStatus
}
