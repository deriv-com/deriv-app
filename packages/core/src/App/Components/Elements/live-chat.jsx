import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'Stores/connect';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const LiveChat = ({ is_mobile_drawer, has_cookie_account }) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);

    React.useEffect(() => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                setLiveChatInteractive(true);
            });
        }
    }, []);

    React.useEffect(() => {
        let session_variables = { loginid: '', landing_company_shortcode: '', currency: '', residence: '' };

        if (has_cookie_account) {
            const domain = window.location.hostname.includes('deriv.com') ? 'deriv.com' : 'binary.sx';
            const client_information = Cookies.get('client_information', {
                domain,
            });
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

                window.LiveChatWidget.call('set_customer_email', email);
                window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
            }
        } else {
            window.LiveChatWidget.call('set_customer_email', ' ');
            window.LiveChatWidget.call('set_customer_name', ' ');
            window.LiveChatWidget.call('set_session_variables', session_variables);
        }
    }, [has_cookie_account]);

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
