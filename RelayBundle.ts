import libp2p from 'libp2p'
import TCP from 'libp2p-tcp'
import Mplex from 'libp2p-mplex'
import SECIO from 'libp2p-secio'
import MulticastDNS from 'libp2p-mdns'

export class RelayBundle extends libp2p {
  constructor(peerInfo: any) {
    const defaults = {
      modules: {
        transport: [TCP],
        streamMuxer: [Mplex],
        connEncryption: [SECIO],
        peerDiscovery: [MulticastDNS]
      },
      config: {
        peerDiscovery: {
          mdns: {
            interval: 2000,
            enabled: true
          }
        },
        EXPERIMENTAL: {
          pubsub: true
        }
      },
      peerInfo
    }

    super(defaults)
  }
}

export const TOPIC = 'cl-r-network'
export const OFFER_PROTOCOL = '/offer/1.0.0'
