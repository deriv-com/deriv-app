import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { deriv_urls, getActionFromUrl } from '@deriv/shared';
import { useIsMounted } from 'usehooks-ts';

// Todo: Should break this into smaller hooks or utility functions.
const useLiveChat = (has_cookie_account = false, active_loginid?: string) => {
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    const reset_password = getActionFromUrl() === 'reset_password';
    const should_disable_livechat = url_params.get('code') && reset_password;

    const [isReady, setIsReady] = useState(false);
    const isMounted = useIsMounted();

    const liveChatSetup = (is_logged_in: boolean) => {
        if (window.LiveChatWidget && !should_disable_livechat) {
            window.LiveChatWidget?.on('ready', () => {
                let client_first_name = '';
                let client_last_name = '';
                const domain = /^(.)*deriv\.(com|me|be)$/gi.test(window.location.hostname)
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
                            window.LiveChatWidget?.call(
                                'set_customer_name',
                                `${client_first_name} ${client_last_name}`
                            );
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
        }
    };

    useEffect(() => {
        window.LiveChatWidget?.on('ready', () => {
            if (isMounted() && !should_disable_livechat) setIsReady(true);
        });
    }, [isMounted]);

    useEffect(() => {
        if (!should_disable_livechat) {
            liveChatSetup(has_cookie_account);
        }
    }, [has_cookie_account, should_disable_livechat]);

    useEffect(() => {
        if (should_disable_livechat) return;
        liveChatSetup(has_cookie_account);
    }, [has_cookie_account, active_loginid, should_disable_livechat]);

    return {
        isReady,
        widget: window.LiveChatWidget,
        LC_API: window.LC_API,
    };
};

export default useLiveChat;
