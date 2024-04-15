import _ from 'lodash';
import lightweightSubscribe from './backend-subscribe';


type BESubscription = {
    ws: any,
    name: string,
    payload: any,

    reqId: string | null,
    subscriptionId: string | null,
    
    unsubcribe: Function | null,

    listeners: Function[],
    lastData: any,
}

/**
 * REQ:
 *  - same key, same backend subscription
 *  - different key, different backend subscription
 *  - fck history / structure etc, just 
 *  - one websocket, if the socket changes, all subscriptions needs to be reinstantiated
 * 
 *  - if multiple components subscribe to the same key, only one backend subscription should be created
 *  
 *  how smart it should be? what about:
 *  - component subscribing multiple times; (we are not aware if thats separate component or not, so we can just subscribe multiple times)
 */

export default (function() {
    const BEsubscriptionsByKey = new Map<string, BESubscription>();
    
    
    function beReceive(beSubscription: BESubscription, data: any) {
        beSubscription.lastData = data;

        if (!beSubscription.listeners || !beSubscription.listeners.length) {
            console.log('>> aggregateSubscribe: no listeners found, returning early, beSubscription: ', beSubscription);
            return;
        }

        for (let listener of beSubscription.listeners) {
            console.log('>> calling listener');
            listener(data);
        }
    }

    async function getBeSubscription(ws: any, name: string, payload: any) : Promise<BESubscription> {
        const key = generateUniqueKey({[name]: 1, ...payload});
        
        if (BEsubscriptionsByKey.has(key)) {
            // @ts-ignore
            return BEsubscriptionsByKey.get(key);
        }

        const beSubscription: BESubscription = {
            ws,
            name,
            payload,
            reqId: null,
            subscriptionId: null,
            unsubcribe: null,
            listeners: [],
            lastData: null,
        }

        BEsubscriptionsByKey.set(key, beSubscription);

        const {
            data,
            reqId,
            subscriptionId,
            unsubcribe,
            // @ts-ignore
        } = await lightweightSubscribe(ws, name, payload, beReceive.bind(this, beSubscription));

        beSubscription.reqId = reqId;
        beSubscription.subscriptionId = subscriptionId;
        beSubscription.lastData = data;
        beSubscription.unsubcribe = unsubcribe;

        return beSubscription;
    }

    // TODO: rename this naming
    async function listen(ws: WebSocket, name: string, payload: any, onData: Function) {
        console.log('>>> aggregatedSubscribe: listen: ', name, payload);
        console.trace();
        // TODO: add tests to ensure, that multiple subscriptions one after another directly to the same key still work and do not clash
        const beSubscription = await getBeSubscription(ws, name, payload);

        beSubscription.listeners.push(onData);

        console.log('>> listener pushed, listeners: ', beSubscription.listeners.length, beSubscription.listeners);

        if (beSubscription.lastData) {
            onData(beSubscription.lastData);
        }

        return {
            unlisten: async () => {
                console.log('>>> aggregatedSubscribe: unlisten: ', name, payload);

                // find and remove listener
                const index = beSubscription.listeners.indexOf(onData);
                
                if (index !== -1) beSubscription.listeners.splice(index, 1);

                // if no more listeners,
                //   - unsubscribe from backend
                //   - remove from BEsubscriptionsByKey
                if (beSubscription.listeners.length === 0) {
                    BEsubscriptionsByKey.delete(generateUniqueKey({[name]: 1, ...payload}));
                    for (let [key, value] of BEsubscriptionsByKey) {
                        if (value === beSubscription) {
                            BEsubscriptionsByKey.delete(key);
                            break; // Stop the loop if you only expect one match, remove if multiple deletes are possible
                        }
                    }

                    //@ts-ignore
                    await beSubscription.unsubcribe();
                }
            }
        }
    }

    async function reinstantiateOnSocketChange(ws: WebSocket) {
        // iterate over BEsubscriptionsByKey
        for (let [key, beSubscription] of BEsubscriptionsByKey) {

            // unsubcribe, just to avoid any dangling listeners
            // @ts-ignore
            beSubscription.unsubcribe();

            // reinstantiate new subscription on existing object
            const {
                data,
                reqId,
                subscriptionId,
            } = await lightweightSubscribe(ws, beSubscription.name, beSubscription.payload, beReceive.bind(beSubscription));
    
            beSubscription.reqId = reqId;
            beSubscription.subscriptionId = subscriptionId;
            beSubscription.lastData = data;
        }
    }

    return {
        listen,
        reinstantiateOnSocketChange,
    }
})();



// I do REALLY dislike the below, like for real, 
// but given circumstances, pretty much no other option
function generateUniqueKey(obj: any): string {
    delete obj.req_id;
    const replacer = (key: string, value: any) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce((sorted: any, key) => {
            sorted[key] = value[key];
            return sorted;
          }, {});
      }
      return value;
    };
  
    return JSON.stringify(obj, replacer);
  }
