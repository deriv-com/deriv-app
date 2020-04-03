import * as SendBird from 'sendbird';
import { requestWS } from './websocket';

let sendbird, channel_list_query;

const init = async () => {
    sendbird = new SendBird({ appId: '447BEDB9-241A-47A5-A199-EC1604D6AD26' }); // sendbird app id
};

const connect = (user_id, token) =>
    Promise((resolve, reject) => {
        // TODO: store in cookies
        // const token = window.localStorage.getItem('sendbird_token');
        sendbird.connect(user_id.trim(), token, (user, error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(user);
        });
    });

// const renewToken = () => {

// }

const getChannelList = () =>
    Promise((resolve, reject) => {
        if (!channel_list_query) {
            channel_list_query = sendbird.GroupChannel.createMyGroupChannelListQuery();
            channel_list_query.includeEmpty = true;
            channel_list_query.limit = 20;
        }
        if (channel_list_query.hasNext && !channel_list_query.isLoading) {
            channel_list_query.next((channelList, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(channelList);
            });
        }
    });

const disconnect = () => {
    // check if its connected
    if (sendbird.currentUser) {
        sendbird.disconnect();
    }
};

const getChannel = channel_url =>
    Promise((resolve, reject) => {
        sendbird.GroupChannel.getChannel(channel_url, (channel, error) => {
            if (error) {
                reject(error);
            }
            resolve(channel);
        });
    });

const chatCreate = order_id =>
    Promise(async (resolve, reject) => {
        const chat_create_response = requestWS({ p2p_chat_create: 1, order_id });
        if (chat_create_response.error) {
            reject(chat_create_response.error.code);
        }
        resolve(chat_create_response.p2p_chat_create);
    });

// you need to pass in the channel to get message list
const getMessageList = channel =>
    Promise((resolve, reject) => {
        if (!channel.query) {
            channel.query = channel.channel.createPreviousMessageListQuery();
        }
        if (channel.query.hasMore && !channel.query.isLoading) {
            channel.query.load(50, false, (messageList, error) => {
                // limit is 50 per frame
                if (error) {
                    reject(error);
                }
                resolve(messageList);
            });
        }
    });

const markAsRead = channel => {
    channel.markAsRead();
};

const sendUserMessage = ({ channel, message, callback }) => {
    return channel.sendUserMessage(message, (message_res, error) => {
        if (callback) callback(message_res, error);
    });
};

const sendFileMessage = ({ channel, file, thumbnailSizes, callback }) => {
    const fileMessageParams = sendbird.FileMessageParams();
    fileMessageParams.file = file;
    fileMessageParams.thumbnailSizes = thumbnailSizes;

    return channel.sendFileMessage(fileMessageParams, (message, error) => {
        if (callback) callback(message, error);
    });
};

const deleteMessage = ({ channel, message }) => {
    return new Promise((resolve, reject) => {
        if (!this.isCurrentUser(message.sender)) {
            reject(Error('You have not ownership in this message.'));
        }
        channel.deleteMessage(message, (response, error) => {
            if (error) {
                reject(error);
            }

            resolve(response);
        });
    });
};

const getTotalUnreadCount = () =>
    Promise(resolve => {
        this.sb.GroupChannel.getTotalUnreadMessageCount(unreadCount => {
            resolve(unreadCount);
        });
    });

const getChannelUnreadCount = channel =>
    Promise(resolve => {
        resolve(channel.unreadMessageCount);
    });

export {
    chatCreate,
    connect,
    deleteMessage,
    disconnect,
    getChannel,
    getChannelList,
    getChannelUnreadCount,
    getMessageList,
    getTotalUnreadCount,
    init,
    markAsRead,
    sendFileMessage,
    sendUserMessage,
};
