import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { liveChatInitialization } from './live-chat';
import Cookies from 'js-cookie';
import { deriv_urls } from '@deriv/shared';

// Todo: Should break this into smaller hooks or utility functions.
const useLiveChat = (has_cookie_account = false) => {
    const [isReady, setIsReady] = useState(false);
    const [reload, setReload] = useState(false);
    const history = useHistory();
    const search_params = window.location.search;
    const widget = window.LiveChatWidget;

    const liveChatDeletion = () =>
        new Promise<void>(resolve => {
            if (window.LiveChatWidget) {
                window.LiveChatWidget.on('ready', () => {
                    try {
                        if (window.LiveChatWidget?.get('customer_data').status !== 'chatting') {
                            window.LiveChatWidget?.call('destroy');
                            resolve();
                        }
                    } catch (e) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

    const onHistoryChange = useCallback(() => {
        liveChatDeletion().then(() => {
            liveChatInitialization().then(() => {
                setReload(true);
                setIsReady(true);
            });
        });
    }, []);

    const liveChatSetup = (is_logged_in: boolean) => {
        window.LiveChatWidget?.on('ready', () => {
            let client_first_name = '';
            let client_last_name = '';
            const domain = /^(.)*deriv\.(com|me)$/gi.test(window.location.hostname)
                ? deriv_urls.DERIV_HOST_NAME
                : 'binary.sx';
            const client_information = Cookies.getJSON('client_information', {
                domain,
            });
            const utm_data = Cookies.getJSON('utm_data', { domain });

            const { utm_source, utm_medium, utm_campaign } = utm_data || {};

            const { loginid, email, landing_company_shortcode, currency, residence, first_name, last_name } =
                client_information || {};

            client_first_name = first_name ?? ' ';
            client_last_name = last_name ?? ' ';

            /* the session variables are sent to CS team dashboard to notify user has logged in
                and also acts as custom variables to trigger targeted engagement */
            const session_variables = {
                is_logged_in: !!is_logged_in,
                loginid: loginid ?? ' ',
                landing_company_shortcode: landing_company_shortcode ?? ' ',
                currency: currency ?? ' ',
                residence: residence ?? ' ',
                email: email ?? ' ',
                utm_source: utm_source ?? ' ',
                utm_medium: utm_medium ?? ' ',
                utm_campaign: utm_campaign ?? ' ',
            };
            window.LiveChatWidget?.call('set_session_variables', session_variables);

            if (is_logged_in) {
                // client logged in
                // prepfill name and email
                window.LiveChatWidget?.call('set_customer_email', session_variables.email);
                window.LiveChatWidget?.call('set_customer_name', `${client_first_name} ${client_last_name}`);

                // prefill name and email fields after chat has ended
                if (window.LC_API?.on_chat_ended) {
                    window.LC_API.on_chat_ended = () => {
                        window.LiveChatWidget?.call('set_customer_email', session_variables.email);
                        window.LiveChatWidget?.call('set_customer_name', `${client_first_name} ${client_last_name}`);
                    };
                }
            } else {
                // client not logged in
                // clear name and email fields
                window.LiveChatWidget?.call('set_customer_email', ' ');
                window.LiveChatWidget?.call('set_customer_name', ' ');
                // clear name and email fields after chat has ended
                if (window.LC_API?.on_chat_ended) {
                    window.LC_API.on_chat_ended = () => {
                        window.LiveChatWidget?.call('set_customer_email', ' ');
                        window.LiveChatWidget?.call('set_customer_name', ' ');
                    };
                }
            }
        });
    };

    useEffect(() => {
        onHistoryChange();
    }, [search_params, onHistoryChange]);

    useEffect(() => {
        if (isReady && !widget) {
            onHistoryChange();
        }
    }, [widget, isReady, onHistoryChange]);

    useEffect(() => {
        history.listen(onHistoryChange);

        window.LiveChatWidget?.on('ready', () => setIsReady(true));
    }, [history, onHistoryChange]);

    useEffect(() => {
        if (reload) {
            liveChatSetup(has_cookie_account);
            setReload(false);
        }
    }, [reload, has_cookie_account]);

    useEffect(() => liveChatSetup(has_cookie_account), [has_cookie_account]);

    return {
        isReady,
        widget: window.LiveChatWidget,
        LC_API: window.LC_API,
    };
};

export default useLiveChat;
