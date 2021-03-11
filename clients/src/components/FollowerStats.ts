import { subscribe, getFollowerState, getAudioState } from "../redux"
import { AudioState } from "../redux/audio"
import { FollowerState } from "../redux/follower"

const template = (audio: AudioState, followerState: FollowerState) => `
    <table>
        <tr>
            <td>time diff with leader</td>
            <td>${followerState.timeDiff} ms</td>
        </tr>
        <tr>
            <td>polyfilled AudioWorkletNode</td>
            <td>${audio.isPollyfilled}</td>
        </tr>
    </table>
`

export default (outerContainer: HTMLElement) => {
    const container = document.createElement('div')
    outerContainer.appendChild(container)
    const update = () => {
        const followerState = getFollowerState()
        if (followerState) {
            container.innerHTML = template(getAudioState(), followerState)
        }
    }
    update()
    subscribe(update)
    return container
}