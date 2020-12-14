import React from 'react';
import Cookies from 'js-cookie';
// import { useHistory } from 'react-router-dom'
import { connect } from 'Stores/connect';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const LiveChat = ({ is_mobile_drawer, has_cookie_account }) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);
    const [has_client_information, setClientInformation] = React.useState(false);

    const liveChatInitialization = () =>
        new Promise(resolve => {
            window.__lc = window.__lc || {}; // eslint-disable-line
            window.__lc.license = 12049137; // eslint-disable-line
            (function (n, t, c) {
                function i(n) {
                    return e._h ? e._h.apply(null, n) : e._q.push(n);
                }
                var e = {
                    _q: [],
                    _h: null,
                    _v: '2.0',
                    on: function () {
                        i(['on', c.call(arguments)]);
                    },
                    once: function () {
                        i(['once', c.call(arguments)]);
                    },
                    off: function () {
                        i(['off', c.call(arguments)]);
                    },
                    get: function () {
                        if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
                        return i(['get', c.call(arguments)]);
                    },
                    call: function () {
                        i(['call', c.call(arguments)]);
                    },
                    init: function () {
                        var n = t.createElement('script');
                        (n.async = !0),
                            (n.type = 'text/javascript'),
                            (n.src = 'https://cdn.livechatinc.com/tracking.js'),
                            t.head.appendChild(n);
                    },
                };
                !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
            })(window, document, [].slice); //eslint-disable-line
            resolve();
        });

    React.useEffect(() => {
        console.log('called'); // eslint-disable-line
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                try {
                    if (window.LiveChatWidget.get('customer_data').status !== 'chatting') {
                        window.LiveChatWidget.call('destroy');
                        console.log('destroyed'); // eslint-disable-line
                        liveChatInitialization().then(() => {
                            console.log('reloaded'); // eslint-disable-line
                            setLiveChatInteractive(true);
                        });
                    } else {
                        console.log('chatting'); // eslint-disable-line
                        setLiveChatInteractive(true);
                    }
                } catch {
                    return; // eslint-disable-line
                }
            });
        }
    });

    // React.useEffect(() => {
    //     history.listen(() => {
    //         if (window.LiveChatWidget) {
    //             if (window.LiveChatWidget.get('customer_data').status !== 'chatting') {
    //                 window.LiveChatWidget.call('destroy');
    //             }
    //         }
    //     })
    // },[history]);

    React.useEffect(() => {
        if (window.LiveChatWidget && is_livechat_interactive) {
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
    }, [has_cookie_account, is_livechat_interactive]);

    React.useEffect(() => {
        if (is_livechat_interactive) {
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
        }
    }, [has_client_information, is_livechat_interactive]);

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
