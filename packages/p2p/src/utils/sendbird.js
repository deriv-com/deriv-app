import * as SendBird from 'sendbird';
import { requestWS } from './websocket';

let sendbird;
export const init = async () => {
    sendbird = new SendBird({ appId: '447BEDB9-241A-47A5-A199-EC1604D6AD26' }); // sendbird app id
    const advertiser_info = await requestWS({ p2p_advertiser_info: 1 });
    console.log(advertiser_info);
};
