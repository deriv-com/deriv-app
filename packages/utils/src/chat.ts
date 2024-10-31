/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './getFeatureFlag';

const Chat = {
    // isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat'),
    isFreshChat: async () => true,
    open: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.open() : window.LiveChatWidget?.call('maximize');
    },
    close: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.close() : window.LiveChatWidget?.call('minimize');
    },
};

export default Chat;
