import { requestWS } from './websocket';

const chatCreate = order_id =>
    new Promise(async (resolve, reject) => {
        const chat_create_response = await requestWS({ p2p_chat_create: 1, order_id });
        if (chat_create_response.error) {
            reject(chat_create_response.error.code);
        }

        resolve(chat_create_response.p2p_chat_create);
    });

export { chatCreate };
