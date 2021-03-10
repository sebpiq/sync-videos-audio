import pEvent from 'p-event';
import { addStartButton } from '../components/StartButton';
import audio from './audio'
import doPolyfilling from './polyfills'
doPolyfilling()

;(window as any).forcePolyfillingAudioWorkletNode = true

const main = async () => {
    const startButton = addStartButton()
    await pEvent(startButton, 'click')

    const audioContext = await audio.createAudioContext()
    console.log(`[main] AudioWorkletNode polyfilled ${(window as any).polyfilledAudioWorkletNode}`)
    console.log('[main] loading + decoding sound')
    const audioBuffer = await audio.loadSound(audioContext, '/media/audio.mp3')
    console.log(`[main] decoding sound | ${audioBuffer.numberOfChannels} channels | ${audioBuffer.length}`)
    await audio.buildAudioGraph(audioContext, audioBuffer)
}

main().then(() => {
    console.log(`client started`)
})
