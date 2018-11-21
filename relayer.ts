import Bb from 'bluebird'
import PeerId from 'peer-id'
import pull from 'pull-stream'

import { RelayBundle, TOPIC, OFFER_PROTOCOL } from './RelayBundle'
import { RelayNetworkNode } from './RelayNetworkNode';
import { Request, Offer } from './types'

export class Relayer {
  private node: RelayBundle;

  constructor(node: RelayBundle) {
    this.node = node;
  }

  static async start(): Promise<Relayer> {
    const node = await RelayNetworkNode.start();

    return new Relayer(node)
  }

  async joinMarket(processMessage: any) {
    return Bb.fromCallback(res =>
      this.node.pubsub.subscribe(
        TOPIC,
        (msg: any) => processMessage(msg, this.node),
        res
      )
    )
  }

  async sendOffer(recipient: string, offer: Offer) {
    console.log(`--- 3 --- Sending offer ${JSON.stringify(offer)}`)
  
    const peer = PeerId.createFromB58String(recipient);
  
    this.node.dialProtocol(peer, OFFER_PROTOCOL, (err: any, conn: any) => {
      pull(pull.values([JSON.stringify(offer)]), conn)
      pull(conn, pull.drain((msg: any) => console.log(msg.toString('utf-8'))))
    })
  }
}
