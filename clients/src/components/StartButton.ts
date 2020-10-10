export const addStartButton = () => {
    const button = document.createElement('button')
    button.innerText = 'START'
    document.body.appendChild(button)
    return button
}