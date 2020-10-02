import * as React from 'react';
import { Loading } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { Channel, SendBirdProvider } from 'sendbird-uikit';
import Dp2pContext from 'Components/context/dp2p-context';
import { getShortNickname, generateHexColourFromNickname } from 'Utils/string';
import 'sendbird-uikit/dist/index.css';

const OrderDetailsChatbox = ({ token, app_id, user_id, channel_url, nickname }) => {
    const isMounted = useIsMounted();

    const [is_loading, setIsLoading] = React.useState(true);
    const { is_dark_mode_on } = React.useContext(Dp2pContext);

    React.useEffect(() => {
        const interval_header = setInterval(() => {
            const el_sendbird_conversation = document.querySelector('.sendbird-conversation');
            const el_chat_title = document.querySelector('.sendbird-chat-header__title');
            const el_chat_avatar = document.querySelector('.sendbird-avatar');

            if (el_chat_title) {
                if (/^Chat about order [0-9]+$/.test(el_chat_title.innerText)) {
                    const short_name = getShortNickname(nickname);
                    const el_chat_header_avatar = document.createElement('div');

                    el_chat_title.innerText = nickname;

                    el_chat_header_avatar.innerText = short_name;
                    el_chat_avatar.appendChild(el_chat_header_avatar);
                    el_chat_avatar.style.backgroundColor = generateHexColourFromNickname(nickname);
                    el_chat_header_avatar.className = 'sendbird-avatar-text';

                    el_sendbird_conversation.setAttribute('style', 'display: flex;');

                    if (isMounted()) {
                        setIsLoading(false);
                    }

                    clearInterval(interval_header);
                }
            }

            const new_character_count_class = 'sendbird-chat-footer--textarea__character-count';

            if (!document.querySelector(`.${new_character_count_class}`)) {
                const el_sendbird_textarea = document.querySelector('.sendbird-message-input--textarea');

                if (el_sendbird_textarea) {
                    const max_length = el_sendbird_textarea.getAttribute('maxlength');
                    const el_character_count = document.createElement('span');
                    const naivelyResetCharacterCounter = () => (el_character_count.innerText = `0/${max_length}`);
                    const syncCharacterCounter = event => {
                        el_character_count.innerText = `${el_sendbird_textarea.value.length}/${max_length}`;

                        if (event.target.value.length > 0) {
                            const el_send_button = document.querySelector('.sendbird-message-input--send');

                            if (el_send_button) {
                                el_send_button.addEventListener('click', naivelyResetCharacterCounter);
                            }
                        }
                    };

                    el_character_count.className = new_character_count_class;
                    el_sendbird_textarea.addEventListener('input', syncCharacterCounter);
                    el_sendbird_textarea.addEventListener('keyup', event => {
                        if (event.key === 'Enter') naivelyResetCharacterCounter();
                    });

                    const el_conversation_footer = document.querySelector('.sendbird-conversation__footer');
                    if (el_conversation_footer) {
                        naivelyResetCharacterCounter();
                        el_conversation_footer.appendChild(el_character_count);
                    }
                }
            }
        }, 100);

        // After 10 secs show container as it may show an error.
        setTimeout(() => {
            const el_sendbird_conversation = document.querySelector('.sendbird-conversation');
            if (el_sendbird_conversation) {
                el_sendbird_conversation.setAttribute('style', 'display: flex;');
            }

            if (isMounted()) {
                setIsLoading(false);
            }
        }, 10000);

        return () => clearInterval(interval_header);
    }, []);

    return (
        <div className={'sendbird-container'}>
            {is_loading && <Loading is_fullscreen={false} />}
            <SendBirdProvider
                appId={app_id}
                userId={user_id}
                accessToken={token}
                theme={is_dark_mode_on ? 'dark' : 'light'}
            >
                <Channel channelUrl={channel_url} />
            </SendBirdProvider>
        </div>
    );
};

export default OrderDetailsChatbox;
