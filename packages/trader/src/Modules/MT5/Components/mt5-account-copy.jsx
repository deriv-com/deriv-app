import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';

class Mt5AccountCopy extends React.PureComponent {
    render() {
        return (
            <Clipboard
                text_copy={this.props.text}
                info_message={localize(
                    'Click here to copy account login number and paste into the login box in MT5 platform along with your password.'
                )}
                success_message={localize('Account login number copied!')}
            />
        );
    }
}

export { Mt5AccountCopy };
