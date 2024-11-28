/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './getFeatureFlag';

const Chat = {
    isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat'),
    isIntercom: async () => getFeatureFlag('enable_intercom'),

    open: async () => {
        const isFreshChat = await Chat.isFreshChat();
        const isIntercom = await Chat.isIntercom();

        if (isFreshChat) {
            window.fcWidget?.open();
        } else if (isIntercom) {
            window.Intercom('show');
        } else {
            window.LiveChatWidget?.call('maximize');
        }
    },

    close: async () => {
        const isFreshChat = await Chat.isFreshChat();
        const isIntercom = await Chat.isIntercom();

        if (isFreshChat) {
            window.fcWidget?.close();
        } else if (isIntercom) {
            window.Intercom('hide');
        } else {
            window.LiveChatWidget?.call('hide');
        }
    },
};

export default Chat;
