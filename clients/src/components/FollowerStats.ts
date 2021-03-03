import { subscribe, getFollowerState } from "../redux"
import { FollowerState } from "../redux/follower"

const template = (followerState: FollowerState) => `
    <table>
        <tr>
            <td>time diff with leader</td>
            <td>${followerState.timeDiff} ms</td>
        </tr>
        <tr>
            <td>polyfilled AudioWorkletNode</td>
            <td>${(window as any).polyfilledAudioWorkletNode}</td>
        </tr>
        polyfilledAudioWorkletNode
    </table>
`

export default (outerContainer: HTMLElement) => {
    const container = document.createElement('div')
    outerContainer.appendChild(container)
    subscribe(() => {
        const followerState = getFollowerState()
        if (followerState) {
            container.innerHTML = template(followerState)
        }
    })
}