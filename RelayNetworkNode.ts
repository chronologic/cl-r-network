import { RelayBundle } from './RelayBundle';
import PeerInfo from 'peer-info';
import Bb from 'bluebird';

export class RelayNetworkNode {
  static async start(): Promise<RelayBundle> {
    const peer: any = await Bb.fromCallback(res => PeerInfo.create(res));
    peer.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
    const node = new RelayBundle(peer);
    await Bb.fromCallback(res => node.start(res));
    node.once('peer:discovery', (p: any) => {
      console.log(`Discovered ${p.id.toB58String()}`);
      node.dial(p, () => { }); //connect to node
    });
    node.once('peer:connect', (p: any) => {
      console.log(`Connected tp ${p.id.toB58String()}`);
      //peers.set(p.id.toB58String(), p) //peer tracking?
    });
    return node;
  }
}