import Bb from 'bluebird'
import Pushable from 'pull-pushable'
import pull from 'pull-stream'

import { RelayBundle, TOPIC, OFFER_PROTOCOL } from './RelayBundle'
import { RelayNetworkNode } from './RelayNetworkNode'
import { Request, Offer } from './types'

interface OfferInfo {
  id: string
  conn: any
  offer: Offer
}

export class Client {
  private node: RelayBundle

  private inbox: Map<number, OfferInfo[]> = new Map<number, OfferInfo[]>()

  constructor(node: RelayBundle) {
    this.node = node

    this.node.handle(OFFER_PROTOCOL, (protocol: any, conn: any) => {
      pull(
        conn,
        pull.drain((msg: any) => {
          console.log(`--- 4 --- Offer received ${JSON.stringify(msg)}`)

          const offer = <Offer>JSON.parse(msg.toString())

          if (!this.inbox.has(offer.id)) this.inbox.set(offer.id, [])
          
          //keep the info on open connection so you can send back
          this.inbox.get(offer.id)!.push({
            id: msg.from,
            conn,
            offer
          } as OfferInfo)
        })
      )
    })
  }

  static async start(): Promise<Client> {
    const node = await RelayNetworkNode.start()
    return new Client(node)
  }

  private respond(request: Request) {
    const offers = this.inbox.get(request.id);
    const acceptedOffer = offers![0];

    console.log(`--- 5 --- Offer accepted ${JSON.stringify(acceptedOffer.offer)}`)

    pull(
      pull.values([`Accepted`]),
      acceptedOffer.conn
    )
  }

  async request(request: Request) {
    const payload = JSON.stringify(request)
    await Bb.fromCallback(res =>
      this.node.pubsub.publish(TOPIC, Buffer.from(payload), res)
    )

    //response to offer logic
    setTimeout(() => this.respond(request), 5000)
  }
}
