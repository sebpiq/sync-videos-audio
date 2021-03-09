import { State } from "../redux/appState"
import { subscribe, getFollowerState, getAppState } from "../redux"
import { FollowerState } from "../redux/follower"

const template = (appState: State, followerState: FollowerState) => `
    <table>
        <tr>
            <td>time diff with leader</td>
            <td>${followerState.timeDiff} ms</td>
        </tr>
        <tr>
            <td>polyfilled AudioWorkletNode</td>
            <td>${appState.audio.isPollyfilled}</td>
        </tr>
    </table>
`

export default (outerContainer: HTMLElement) => {
    const container = document.createElement('div')
    outerContainer.appendChild(container)
    subscribe(() => {
        const followerState = getFollowerState()
        if (followerState) {
            container.innerHTML = template(getAppState(), followerState)
        }
    })
}