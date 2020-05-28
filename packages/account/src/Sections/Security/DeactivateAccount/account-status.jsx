import React from 'react';
import { localize } from '@deriv/translations';

class AccountStatus extends React.Component {
    render() {
        return (
            <div className='open-positions'>
                <p className='open-positions__title'>{localize('You have open positions in these Deriv accounts:')}</p>
            </div>
        );
    }
}

export default AccountStatus;
