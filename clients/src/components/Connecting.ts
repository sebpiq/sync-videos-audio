import jss from 'jss'

const { classes } = jss
    .createStyleSheet({
        container: {
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            position: 'fixed',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            'text-align': 'center',
            'flex-direction': 'column',
            'text-transform': 'uppercase',

            '& .loader, & .loader:before, & .loader:after': {
                'border-radius': '50%',
                width: '2.5em',
                height: '2.5em',
                'animation-fill-mode': 'both',
                animation: '$load7 1.8s infinite ease-in-out',
            },
            '& .loader': {
                color: '#000',
                'font-size': '10px',
                margin: '0px auto',
                position: 'relative',
                'text-indent': '-9999em',
                transform: 'translateZ(0)',
                'animation-delay': '-0.16s',
            },
            '& .loader:before, & .loader:after': {
                content: '""',
                position: 'absolute',
                top: 0,
            },
            '& .loader:before': {
                left: '-3.5em',
                'animation-delay': '-0.32s',
            },
            '& .loader:after': {
                left: '3.5em',
            },
        },
        '@keyframes load7': {
            '0%, 80%, 100%': {
                'box-shadow': '0 2.5em 0 -1.3em',
            },
            '40%': {
                'box-shadow': '0 2.5em 0 0',
            },
        },
    })
    .attach()

const template = () => `
    <div class="${classes.container}">
        <div>
            Connecting ...
            <div class="loader">Loading...</div>
        </div>
    </div>
`

export default (outerContainer: HTMLElement) => {
    const container = document.createElement('div')
    outerContainer.appendChild(container)
    container.innerHTML = template()
    return container
}
