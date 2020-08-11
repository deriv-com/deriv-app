import React from 'react';
import Cookies from 'js-cookie';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const LiveChat = ({ is_mobile_drawer }) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                setLiveChatInteractive(true);
            });
            window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                const domain = window.location.hostname.includes('deriv.com') ? 'deriv.com' : 'binary.sx';
                const client_information = Cookies.get('client_information', {
                    domain,
                });
                // only visible to CS
                let session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '' };

                if (visibility === 'maximized') {
                    if (client_information) {
                        const {
                            loginid,
                            email,
                            landing_company_shortcode,
                            currency,
                            residence,
                            first_name,
                            last_name,
                        } = JSON.parse(client_information);
                        session_variables = {
                            ...(loginid && { loginid }),
                            ...(landing_company_shortcode && { landing_company_shortcode }),
                            ...(currency && { currency }),
                            ...(residence && { residence }),
                        };

                        window.LiveChatWidget.call('set_session_variables', session_variables);

                        if (email) window.LiveChatWidget.call('set_customer_email', email);
                        if (first_name && last_name)
                            window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
                    }
                } else {
                    window.LiveChatWidget.call('set_customer_email', ' ');
                    window.LiveChatWidget.call('set_customer_name', ' ');
                    window.LiveChatWidget.call('set_session_variables', session_variables);
                }
            });
        }
    }, []);

    return (
        <>
            {is_livechat_interactive && (
                <>
                    {is_mobile_drawer ? (
                        <div
                            className='livechat'
                            onClick={() => {
                                window.LC_API.open_chat_window();
                            }}
                        >
                            <Icon icon='IcLiveChat' className='livechat__icon' />
                            <p className='livechat__title'>{localize('Live chat')}</p>
                        </div>
                    ) : (
                        <Popover
                            className='footer__link'
                            classNameBubble='help-centre__tooltip'
                            alignment='top'
                            message={localize('Live chat')}
                            id='gtm-deriv-livechat'
                        >
                            <Icon
                                icon='IcLiveChat'
                                className='footer__icon'
                                onClick={() => {
                                    window.LC_API.open_chat_window();
                                }}
                            />
                        </Popover>
                    )}
                </>
            )}
        </>
    );
};

export default LiveChat;
