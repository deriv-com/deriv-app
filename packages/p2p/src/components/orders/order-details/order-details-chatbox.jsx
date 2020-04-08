import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ appId, userId, channelUrl }) => (
    <SendBirdProvider appId={appId} userId={userId}>
        <Channel channelUrl={channelUrl} />
    </SendBirdProvider>
);

export default OrderDetailsChatbox;
