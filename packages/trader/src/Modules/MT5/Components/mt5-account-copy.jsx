import React from 'react';
import { Icon } from '@deriv/components';
import { copyToClipboard } from '_common/utility';
import { localize } from '@deriv/translations';
import Tooltip from '../Containers/tooltip.jsx';

class Mt5AccountCopy extends React.PureComponent {
    state = {
        copied: false,
    };

    onClick = () => {
        copyToClipboard(this.props.text);
        this.setState({
            copied: true,
        });
        setTimeout(() => {
            this.setState({
                copied: false,
            });
        }, 2000);
    };

    render() {
        return (
            <React.Fragment>
                {!this.state.copied && (
                    <Tooltip
                        message={localize(
                            'Click here to copy account login number and paste into the login box in MT5 platform along with your password.'
                        )}
                    >
                        <Icon icon='IcClipboard' className='mt5-account-card__clipboard' onClick={this.onClick} />
                    </Tooltip>
                )}
                {this.state.copied && (
                    <Tooltip message={localize('Account login number copied!')}>
                        <Icon icon='IcInfoOutline' className='mt5-account-card__clipboard' />
                    </Tooltip>
                )}
            </React.Fragment>
        );
    }
}

export { Mt5AccountCopy };
