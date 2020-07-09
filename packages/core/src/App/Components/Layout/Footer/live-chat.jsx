import React from 'react';
import { Popover, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

class LiveChat extends React.Component {
    state = {
        is_livechat_interactive: false,
    };

    componentDidMount() {
        window.LiveChatWidget.on('ready', () => {
            this.setState({ is_livechat_interactive: true });
        });
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

export { LiveChat };
