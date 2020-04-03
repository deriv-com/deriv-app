import * as SendBird from 'sendbird';
import { requestWS } from './websocket';

let sendbird;
let channel_list_query;
export const init = async () => {
    sendbird = new SendBird({ appId: '447BEDB9-241A-47A5-A199-EC1604D6AD26' }); // sendbird app id
    const advertiser_info = await requestWS({ p2p_advertiser_info: 1 });

    if (!(advertiser_info.chat_token && advertiser_info.chat_user_id)) {
        const advertiser_create = await requestWS({ p2p_advertiser_create: 1, name: 'sldfjsflksjdlkfsjflkdfj' });
    } else {
        connect(advertiser_info.chat_user_id, advertiser_info.chat_token);
    }
};

export const connect = (user_id, token) => {
    // const token = window.localStorage.getItem('sendbird_token');
    sendbird.connect(user_id.trim(), token, (user, error) => {
        if (error) {
            console.error(error);
            return;
        }
    });
};

export const getChannelList = () =>
    Promise((resolve, reject) => {
        if (!channel_list_query) {
            channel_list_query = sendbird.GroupChannel.createMyGroupChannelListQuery();
            channel_list_query.includeEmpty = true;
            channel_list_query.limit = 20;
        }
        if (channel_list_query.hasNext && !channel_list_query.isLoading) {
            channel_list_query.next(function(channelList, error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(channelList);
            });
        }
    });

export const requestSendbird = () => sendbird;
