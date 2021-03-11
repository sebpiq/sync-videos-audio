// import state from "../redux/appState"

import { incrementResyncTimeDiff } from "../../redux/follower"
import { dispatch, getFollowerState, subscribe } from "../../redux"
import jss from "jss"

const DELAY_INCREMENT_MS = 20

const {classes} = jss.createStyleSheet({
    container: {
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'position': 'fixed',
        'height': '100%',
        'width': '100%',
        'top': 0,
        'left': 0,
        'text-align': 'center',
        'flex-direction': 'row',
    },
    button: {
        height: '100%',
        'font-size': '110%',
        'width': '10em',
        'cursor': 'pointer',
        'border': 'none',
        '&.less': {
            'background-color': 'rgba(255, 0, 0, 0.1)',
            'text-align': 'left',
        },
        '&.more': {
            'background-color': 'rgba(0, 255, 0, 0.1)',
            'text-align': 'right',
        }
    },
    display: {
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translateX(-50%)'
    }
}).attach()


const formatCurrentDelay = (delayMs: number) =>
    `${Math.round(delayMs) / 1000} seconds`


const template = `
    <div class="${classes.container}">
        <button class="${classes.button} less">The sound is behind the image</button>
        <span class="${classes.display} current"></span>
        <button class="${classes.button} more">The sound is ahead of the image</button>
    </div>
`

export default (container: HTMLElement) => {
    container.insertAdjacentHTML('beforeend', template)
    container.querySelector<HTMLButtonElement>('.less').onclick = () => {
        dispatch(incrementResyncTimeDiff(-DELAY_INCREMENT_MS))
    }
    container.querySelector<HTMLButtonElement>('.more').onclick = () => {
        dispatch(incrementResyncTimeDiff(DELAY_INCREMENT_MS))
    }
    subscribe(() => {
        container.querySelector('.current').innerHTML = getFollowerState().resyncTimeDiff ? formatCurrentDelay(getFollowerState().resyncTimeDiff) : ''
    })
    return container
}
