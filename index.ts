
import Bb from 'bluebird'
import { Relayer } from './relayer';
import { Client } from './client';
import { Request, Offer } from './types'

const peers = new Map<string, any>()

async function main() {
  console.log('Spawning relayers')
  const r1 = await Relayer.start();
  //const r2 = await createNode();

  console.log('Relayers listening to pubsub')
  await r1.joinMarket((msg: any) => {
    console.log(`--- 2 --- Received request ${JSON.stringify(msg)}`)

    const request = <Request>JSON.parse(msg.data)

    const offer = Object.assign(request, {
      amount: Math.random() * 10000
    }) as Offer
  
    r1.sendOffer(msg.from, offer)
  });

  console.log('Spawning client')
  const user = await Client.start()

  console.log('Waiting for network to boot')
  await Bb.fromCallback(res => setTimeout(res, 3000))

  const request = { id: 1, asset: 10 } as Request
  const payload = JSON.stringify(request)

  console.log(`--- 1 --- Sending request ${payload}`)
  await user.request(request);
}

main()
