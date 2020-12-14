// import state from "../redux/appState"

const DELAY_INCREMENT_MS = 20

const formatCurrentDelay = (delayMs: number) => 
    `${Math.round(delayMs) / 1000} seconds`

const template = `
    <div>
        <button class="less">-${DELAY_INCREMENT_MS}ms</button>
        <span class="current">${formatCurrentDelay(0)}</span>
        <button class="more">+${DELAY_INCREMENT_MS}ms</button>
    </div>
`

export default (container: HTMLElement) => {
    container.insertAdjacentHTML('beforeend', template)
    // container.querySelector<HTMLButtonElement>('.less').onclick = () => {
    //     state.incrementSyncStateDelay(-DELAY_INCREMENT_MS)
    // }
    // container.querySelector<HTMLButtonElement>('.more').onclick = () => {
    //     state.incrementSyncStateDelay(DELAY_INCREMENT_MS)
    // }
    // state.subscribe(() => {
    //     container.querySelector('.current').innerHTML = formatCurrentDelay(state.get().syncState.delayMs)
    // })
}