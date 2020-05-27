import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { copyToClipboard } from '_common/utility';
import { localize } from '@deriv/translations';

class Mt5AccountCopy extends React.PureComponent {
    state = {
        is_copied: false,
    };

    copyLoginNumber = () => {
        copyToClipboard(this.props.text);
        this.setState({
            is_copied: true,
        });
        setTimeout(() => {
            this.setState({
                is_copied: false,
            });
        }, 2000);
    };

    render() {
        return (
            <div onClick={this.copyLoginNumber}>
                <Popover
                    classNameBubble='mt5-account-card__tooltip'
                    alignment='bottom'
                    className='mt5-account-card__clipboard'
                    margin={-3}
                    message={
                        this.state.is_copied
                            ? localize('Account login number copied!')
                            : localize(
                                  'Click here to copy account login number and paste into the login box in MT5 platform along with your password.'
                              )
                    }
                >
                    {this.state.is_copied ? (
                        <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' />
                    ) : (
                        <Icon icon='IcClipboard' custom_color='var(--text-less-prominent)' />
                    )}
                </Popover>
            </div>
        );
    }
}

export { Mt5AccountCopy };
