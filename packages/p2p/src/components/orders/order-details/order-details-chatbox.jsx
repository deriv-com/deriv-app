import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url, nickname }) => {
    React.useEffect(() => {
        const interval_header = setInterval(() => {
            const chat_title_element = document.querySelector('.sendbird-chat-header__title');
            const chat_avatar = document.querySelector('.sendbird-chat-header__avatar');
            const acronym = nickname.match(/\b(\w)/g).join('');
            if (chat_title_element.innerText === 'No title') return;
            if (chat_title_element.innerText === nickname && chat_avatar.innerText === acronym)
                clearInterval(interval_header);

            chat_title_element.innerText = nickname;
            chat_avatar.innerText = acronym;
        }, 500);

        return () => {
            clearInterval(interval_header);
        };
    }, []);

    return (
        <SendBirdProvider appId={app_id} userId={user_id} accessToken={token}>
            <Channel channelUrl={channel_url} />
        </SendBirdProvider>
    );
};

export default OrderDetailsChatbox;
