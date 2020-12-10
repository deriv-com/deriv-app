import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'Stores/connect';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const LiveChat = ({ is_mobile_drawer, has_cookie_account }) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);
    const [has_client_information, setClientInformation] = React.useState(false);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                setLiveChatInteractive(true);
            });
        }
    }, []);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                let session_variables = {
                    loginid: '',
                    landing_company_shortcode: '',
                    currency: '',
                    residence: '',
                    email: '',
                };

                if (has_cookie_account) {
                    const domain = window.location.hostname.includes('deriv.com') ? 'deriv.com' : 'binary.sx';
                    const client_information = Cookies.get('client_information', {
                        domain,
                    });
                    if (client_information) {
                        setClientInformation(true);
                        const {
                            loginid,
                            email,
                            landing_company_shortcode,
                            currency,
                            residence,
                            first_name,
                            last_name,
                        } = JSON.parse(client_information) || {};
                        session_variables = {
                            ...(loginid && { loginid }),
                            ...(landing_company_shortcode && { landing_company_shortcode }),
                            ...(currency && { currency }),
                            ...(residence && { residence }),
                            ...(email && { email }),
                        };

                        window.LiveChatWidget.call('set_session_variables', session_variables);
                        window.LiveChatWidget.call('set_customer_email', email);
                        window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
                    } else {
                        setClientInformation(false);
                    }
                }
            });
        }
    }, [has_cookie_account]);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                window.LC_API.on_chat_ended = () => {
                    if (!has_client_information) {
                        window.LiveChatWidget.call('set_customer_email', ' ');
                        window.LiveChatWidget.call('set_customer_name', ' ');
                    }
                };
            });
        }
    }, [has_client_information]);

    return (
        <>
            {is_livechat_interactive && (
                <>
                    {is_mobile_drawer ? (
                        <div
                            className='livechat gtm-deriv-livechat'
                            onClick={() => {
                                window.LiveChatWidget.call('maximize');
                            }}
                        >
                            <div className='livechat__icon-wrapper'>
                                <Icon icon='IcLiveChat' className='livechat__icon' />
                            </div>
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
                                className='footer__icon gtm-deriv-livechat'
                                onClick={() => {
                                    window.LiveChatWidget.call('maximize');
                                }}
                            />
                        </Popover>
                    )}
                </>
            )}
        </>
    );
};

export default connect(({ client }) => ({
    has_cookie_account: client.has_cookie_account,
}))(LiveChat);
