import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url, nickname }) => {
    setInterval(() => {
        const chat_title_element = document.querySelector('.sendbird-chat-header__title');
        if (chat_title_element && chat_title_element.innerText !== nickname) {
            chat_title_element.setAttribute('data-content', nickname);
        }

        const chat_avatar_elements = document.getElementsByClassName('sendbird-avatar');
        if (chat_avatar_elements) {
            const matches = nickname.match(/\b(\w)/g);
            const acronym = matches.join('');

            Array.from(chat_avatar_elements).map(element => {
                if (element.innerText !== acronym) {
                    element.innerText = acronym;
                }
            });
        }

        if (!document.querySelector('.sendbird-chat-header__info-container')) {
            const chat_info_container_element = document.createElement('div');
            chat_info_container_element.className = 'sendbird-chat-header__info-container';
            chat_info_container_element.appendChild(chat_title_element);
            chat_info_container_element.appendChild(document.querySelector('.sendbird-chat-header__subtitle'));
            document.querySelector('.sendbird-chat-header__left').appendChild(chat_info_container_element);
        }
    }, 1000);

    return (
        <SendBirdProvider appId={app_id} userId={user_id} accessToken={token}>
            <Channel channelUrl={channel_url} />
        </SendBirdProvider>
    );
};

export default OrderDetailsChatbox;
