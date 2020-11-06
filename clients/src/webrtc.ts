// REFS :
//   - https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample
//   - https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/adapter.js
import * as pEvent from 'p-event'
import {
    WebRtcSignalingAnswerMessage,
    WebRtcSignalingOfferMessage,
} from './shared/websocket-messages'
import state from './state'
import websocket from './websocket'
import * as SimplePeer from 'simple-peer'

const openLeader = async (): Promise<void> => {
    const connections = []

    while (true) {
        console.log('webrtc : waiting for connection')
        const connection = new SimplePeer({
            initiator: false,
            trickle: false,
        })        
        console.log('webrtc : incoming connection')
        connections.push(connection)



        connection.on('error', (err) => console.log('error', err))

        connection.on('signal', (data) => {
            console.log('SIGNAL', JSON.stringify(data))
            document.querySelector('#outgoing').textContent = JSON.stringify(data)
        })

        document.querySelector('form').addEventListener('submit', (ev) => {
            ev.preventDefault()
            connection.signal(JSON.parse(document.querySelector('#incoming').value))
        })

        connection.on('connect', () => {
            console.log('CONNECT')
            connection.send('whatever' + Math.random())
        })

        connection.on('data', (data) => {
            console.log('data: ' + data)
        })
    }

    // state.set({
    //     webRtc: {
    //         connection,
    //         channel,
    //     },
    // })
}

const openFollower = async (): Promise<void> => {
    // Create the local connection and its event listeners
    const connection = new SimplePeer({
        initiator: true,
        trickle: false,
    })

    // Set up the ICE candidates for the two peers
    connection.onicecandidate = (e) => console.log('ICE candidate', e)
    connection.addEventListener('connectionstatechange', () =>
        console.log('CONN STATE', connection.connectionState)
    )

    // //   .catch(handleAddCandidateError);

    // remoteConnection.onicecandidate = (e) =>
    //     !e.candidate || connection.addIceCandidate(e.candidate) //.catch(handleAddCandidateError);

    // Now create an offer to connect; this starts the process
    console.log('webrtc : start negotiation process')
    const offer = await connection.createOffer()
    await connection.setLocalDescription(offer)
    websocket.send({
        type: 'webrtc-signaling-offer',
        payload: connection.localDescription,
    })

    // Wait for the answer
    console.log('webrtc : wait for answer')
    const signalingAnswer = await websocket.onceMessage<
        WebRtcSignalingAnswerMessage
    >('webrtc-signaling-answer')
    console.log('webrtc : answer received')
    await connection.setRemoteDescription(signalingAnswer.payload)

    // Make sure channel is open
    console.log('webrtc : waiting for channel to open')

    // Create the data channel and establish its event listeners
    const channel = connection.createDataChannel('followerChannel')
    const openChannelPromise = pEvent(channel, 'open')
    // TODO : reconnect
    channel.onclose = () => console.error('send channel CLOSED')
    channel.onopen = () => console.error('send channel OPEN')

    // await openChannelPromise
    console.log('webrtc : connection established')

    state.set({
        webRtc: {
            connection,
            channel,
        },
    })
}

// Handles clicks on the "Send" button by transmitting
// a message to the remote peer.

const send = async () => {
    //message: Message) => {
    state.get().webRtc.channel.send('blo bli bla blu')
}

// Handle onmessage events for the receiving channel.
// These are the data messages sent by the sending channel.

function handleReceiveMessage(event: MessageEvent) {
    console.log('RTC received' + event.data)
}

export default { openFollower, openLeader, send } //, listen, events: pEventEmitter }
