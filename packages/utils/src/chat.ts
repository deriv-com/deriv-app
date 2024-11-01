/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './getFeatureFlag';

const Chat = {
    isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat'),
    open: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.open() : window.LiveChatWidget?.call('maximize');
    },
    close: async () => {
        (await Chat.isFreshChat()) ? window.fcWidget?.close() : window.LiveChatWidget?.call('hide');
    },
};

export default Chat;
