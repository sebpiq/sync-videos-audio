import jss from "jss"

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
        'flex-direction': 'column',
    },
    button: {
        'font-size': '110%',
        'text-transform': 'uppercase',
        'width': '10em',
        'padding': '3em',
        'border': '3px solid black',
        'cursor': 'pointer',
        'background-color': 'transparent',
    }
}).attach()

const template = () => `
    <div class="${classes.container}">
        <button class="${classes.button}">
            Start
        </button>
    </div>
`

export default (outerContainer: HTMLElement) => {
    const container = document.createElement('div')
    container.innerHTML = template()
    const elem = container.children[0]
    outerContainer.appendChild(elem)
    return elem
}
