/* This utility function is responsible to pop out currently
 enabled widget based on growthbook feature flag */

import getFeatureFlag from './getFeatureFlag';

const Chat = {
    isFreshChat: async () => getFeatureFlag('enable_freshworks_live_chat'),
    isIntercom: true, //async () => getFeatureFlag('enable_intercom'),

    getFlags: async () => {
        try {
            const [isFreshChat, isIntercom] = await Promise.all([Chat.isFreshChat(), Chat.isIntercom]);
            return { isFreshChat, isIntercom };
        } catch (_error) {
            return { isFreshChat: false, isIntercom: false };
        }
    },

    open: async () => {
        const isFreshChat = await Chat.isFreshChat();
        const isIntercom = await Chat.isIntercom;

        if (isFreshChat) {
            window.fcWidget?.open();
        } else if (isIntercom) {
            window.Intercom('show');
        } else {
            window.LiveChatWidget?.call('maximize');
        }
    },

    clear: async () => {
        const { isFreshChat, isIntercom } = await Chat.getFlags();
        if (isFreshChat) {
            window.fcWidget?.user.clear();
        } else if (isIntercom && window.Intercom) {
            window.Intercom('shutdown');
            window.DerivInterCom.initialize({
                hideLauncher: true,
                token: null,
            });
        }
    },

    close: async () => {
        const { isFreshChat, isIntercom } = await Chat.getFlags();

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
