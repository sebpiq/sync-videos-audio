import * as sinon from 'sinon'
import lag from './lag'
import * as assert from 'assert'

describe('lag', () => {
    const sandbox = sinon.createSandbox()
    let fakeSendLagQuery: sinon.SinonStub
    let fakeDateNow: sinon.SinonStub

    beforeEach(function () {
        fakeSendLagQuery = sandbox.stub(lag, 'sendLagQuery')
        fakeDateNow = sandbox.stub(Date, 'now')
    })

    afterEach(function () {
        sandbox.restore()
    })

    describe('detectLag', () => {
        it('should send lag queries and return the average lag', async () => {
            const halfRoundTrip = 2
            const expectedLag = 3
            fakeSendLagQuery.callsFake((leaderTimestamp) => ({
                type: 'lag-response',
                payload: {
                    leaderTimestamp,
                    followerTimestamp:
                        leaderTimestamp + expectedLag + halfRoundTrip,
                },
            }))
            // even is `leaderTimestamp`, odd is after roundtrip time`
            fakeDateNow.callsFake(() =>
                (fakeDateNow.callCount - 1) % 2 === 0
                    ? 1234
                    : 1234 + halfRoundTrip * 2
            )

            const actualLag = await lag.detectLagLeader()
            assert.strictEqual(fakeSendLagQuery.callCount, lag.LAG_QUERY_COUNT)
            assert.strictEqual(actualLag, expectedLag)
        })
    })
})
