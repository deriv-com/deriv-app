import React from 'react';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url, nickname }) => {
    React.useEffect(() => {
        const interval_header = setInterval(() => {
            const new_container_classname = 'sendbird-chat-header__info-container';
            const el_sendbird_conversation = document.querySelector('.sendbird-conversation');
            const el_chat_title = document.querySelector('.sendbird-chat-header__title');
            const el_chat_avatars = document.getElementsByClassName('sendbird-avatar');
            const el_chat_subtitle = document.querySelector('.sendbird-chat-header__subtitle');
            const el_new_container = document.querySelector(`.${new_container_classname}`);
            const el_message_input = document.querySelector('.sendbird-message-input--textarea');
            const el_chat_footer = document.querySelector('.sendbird-conversation__footer');

            if (el_chat_title) {
                if (el_chat_title.innerText === 'No title') {
                    // On first load Sendbird doesn't have title.
                    return;
                } else if (el_chat_title.innerText !== nickname) {
                    // If the innertext doesn't equal the user's nickname, update it. Only then
                    // show the sendbird box.
                    el_chat_title.innerText = nickname;
                    el_sendbird_conversation.setAttribute('style', 'display: flex;');
                }
            }

            if (el_chat_avatars) {
                // TODO: Use common function for getting _initials_
                const acronym = nickname.match(/\b(\w)/g).join('');
                Array.from(el_chat_avatars).map(element => {
                    if (element.innerText !== acronym) {
                        element.innerText = acronym;
                    }
                });
            }

            if (!el_new_container) {
                // Container element.
                const el_chat_info_container = document.createElement('div');
                el_chat_info_container.className = new_container_classname;

                if (el_chat_title) {
                    // Set the title to the user's nickname.
                    const el_new_chat_title = document.createElement('div');
                    el_new_chat_title.classList.add(...el_chat_title.classList);
                    el_new_chat_title.innerText = nickname;
                    el_chat_title.setAttribute('style', 'display: none;');
                    el_chat_info_container.appendChild(el_new_chat_title);
                }

                // If there's no message, there's no subtitle.
                if (el_chat_subtitle) {
                    const el_new_chat_subtitle = document.createElement('div');
                    el_new_chat_subtitle.classList.add(...el_chat_subtitle.classList);
                    el_new_chat_subtitle.innerText = el_chat_subtitle.innerText;
                    el_chat_subtitle.setAttribute('style', 'display: none;');
                    el_chat_info_container.appendChild(el_new_chat_subtitle);
                }

                const el_chat_header_left = document.querySelector('.sendbird-chat-header__left');
                if (el_chat_header_left) {
                    el_chat_header_left.appendChild(el_chat_info_container);
                }
            }

            const getCharCount = input => `${input.value.length}/${input.getAttribute('maxlength')}`;
            if (el_message_input) {
                const new_character_count_classname = 'sendbird-chat-footer--textarea__character-count';
                if (!document.querySelector(`.${new_character_count_classname}`)) {
                    const el_new_character_count = document.createElement('span');
                    el_new_character_count.className = new_character_count_classname;
                    el_new_character_count.innerText = getCharCount(el_message_input);

                    el_message_input.addEventListener('input', e => {
                        el_new_character_count.innerText = getCharCount(e.target);
                    });

                    el_chat_footer.appendChild(el_new_character_count);
                }
            }
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
