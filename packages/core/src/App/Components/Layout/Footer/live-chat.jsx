import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';

class LiveChat extends React.Component {
    state = {
        is_livechat_interactive: false,
    };

    componentDidMount() {
        const { email, is_logged_in, loginid, landing_company_shortcode, currency, residence } = this.props;
        if (window.LiveChatWidget) {
            WS.authorized.getSettings({ get_settings: 1 }).then(response => {
                const get_settings = response.get_settings || {};
                const { first_name, last_name } = get_settings;

                if (email) window.LiveChatWidget.call('set_customer_email', email);
                if (first_name && last_name)
                    window.LiveChatWidget.call('set_customer_name', `${first_name} ${last_name}`);
            });

            window.LiveChatWidget.on('ready', () => {
                this.setState({ is_livechat_interactive: true });
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
    }

    render() {
        return (
            <>
                {this.state.is_livechat_interactive && (
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
                        />
                    </Popover>
                )}
            </>
        );
    }
}

export default connect(({ client }) => ({
    email: client.email,
    is_logged_in: client.is_logged_in,
    loginid: client.loginid,
    landing_company_shortcode: client.landing_company_shortcode,
    currency: client.currency,
    residence: client.residence,
}))(LiveChat);
