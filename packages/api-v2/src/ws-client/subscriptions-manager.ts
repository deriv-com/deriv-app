import _ from 'lodash';
import BackendSubscription from './subscription';

export default class SubscriptionsManager {
    backendSubscriptions: Map<string, BackendSubscription> = new Map();
    ws: WebSocket;
   
    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    async subscribe(name: string, payload: any, onData: Function) {
        const key : string = generateUniqueKey({[name]: 1, ...payload});
        
        let backendSubscription : BackendSubscription | undefined; 

        if (!this.backendSubscriptions.has(key)) {
            this.backendSubscriptions.set(key, new BackendSubscription(this.ws, name, payload, onData));
        }

        backendSubscription = this.backendSubscriptions.get(key);            

        // @ts-ignore
        await backendSubscription.subscribe();

        backendSubscription?.addListener(onData);
        
        if (backendSubscription?.lastData) {
            onData(backendSubscription.lastData);
        }

        return {
            unsubscribe: async () => {
                 // find and remove listener
                backendSubscription?.removeListener(onData);

                // if no more listeners,
                //   - unsubscribe from backend
                //   - remove from BEsubscriptionsByKey
                if (backendSubscription?.listeners.length === 0) {
                    this.backendSubscriptions.delete(key);
                   
                    await backendSubscription.unsubscribe();
                }
            }
        }
    }
}


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
