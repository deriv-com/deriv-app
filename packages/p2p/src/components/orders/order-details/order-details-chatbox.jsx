import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url, advertiser_name }) => {
    return (
        <SendBirdProvider appId={app_id} userId={user_id} accessToken={token} nickname={advertiser_name}>
            <Channel channelUrl={channel_url} />
        </SendBirdProvider>
    );
};

export default OrderDetailsChatbox;
