import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import BinarySocket from '_common/base/socket_base';
import { connect } from 'Stores/connect';

const LiveChat = ({
    email,
    is_logged_in,
    is_mobile_drawer,
    loginid,
    landing_company_shortcode,
    currency,
    residence,
}) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            BinarySocket.wait('get_settings').then(response => {
                const get_settings = response.get_settings || {};
                const { first_name, last_name } = get_settings;

                if (email) window.LiveChatWidget.call('set_customer_email', email);
                if (first_name && last_name)
                    window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
            });

            window.LiveChatWidget.on('ready', () => {
                setLiveChatInteractive(true);
            });
            window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
                // only visible to CS
                let session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '' };

                if (visibility === 'maximized' && is_logged_in) {
                    session_variables = {
                        ...(loginid && { loginid }),
                        ...(landing_company_shortcode && { landing_company_shortcode }),
                        ...(currency && { currency }),
                        ...(residence && { residence }),
                    };

                    window.LiveChatWidget.call('set_session_variables', session_variables);
                }

                if (visibility === 'maximized' && !is_logged_in) {
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
                            className='gtm-deriv-livechat'
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
                        >
                            <Icon
                                icon='IcLiveChat'
                                className='footer__icon'
                                onClick={() => {
                                    window.LC_API.open_chat_window();
                                }}
                                className='gtm-deriv-livechat'
                            />
                        </Popover>
                    )}
                </>
            )}
        </>
    );
};

export default connect(({ client }) => ({
    email: client.email,
    is_logged_in: client.is_logged_in,
    loginid: client.loginid,
    landing_company_shortcode: client.landing_company_shortcode,
    currency: client.currency,
    residence: client.residence,
}))(LiveChat);
