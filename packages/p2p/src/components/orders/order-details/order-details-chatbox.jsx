import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url }) => {
    const nickname = 'Joseph Joestar';
    setInterval(() => {
        const chat_title_element = document.querySelector('.sendbird-chat-header__title');
        if (chat_title_element && chat_title_element.innerText !== nickname) {
            chat_title_element.setAttribute('data-content', nickname);
        }

        const chat_avatar_elements = document.getElementsByClassName('sendbird-avatar');
        if (chat_avatar_elements) {
            var matches = nickname.match(/\b(\w)/g);
            var acronym = matches.join('');

            Array.from(chat_avatar_elements).map(element => (element.innerText = acronym));
        }
    }, 1000);

    return (
        <SendBirdProvider appId={app_id} userId={user_id} accessToken={token}>
            <Channel channelUrl={channel_url} />
        </SendBirdProvider>
    );
};

export default OrderDetailsChatbox;
