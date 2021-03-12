import { Snapshot } from "../../shared/types"

export const computeCurrentTime = (leaderSnapshot: Snapshot, timeDiff: number) => {
    // The time diff is relative to the leader : [timeDiff = local - leader]
    const timestampLocal = leaderSnapshot.timestamp + timeDiff
    const adjustment = (Date.now() - timestampLocal)
    return leaderSnapshot.position + adjustment
}

export const applyManualResync = (currentTime: number, timeDiff: number) => 
    currentTime - timeDiff