import React from 'react';
import { screen, render } from '@testing-library/react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTurnoverLimitRow from '../account-limits-turnover-limit-row';
import AccountLimitsContext from '../account-limits-context';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatMoney: jest.fn(),
}));
const AccountLimitsTurnoverLimitRowComponent = props => (
    <AccountLimitsContext.Provider value={{ currency: 'AUD' }}>
        <AccountLimitsTurnoverLimitRow {...props} />
    </AccountLimitsContext.Provider>
);

describe('<AccountLimitsTurnoverLimitRow/>', () => {
    const props = {
        collection: [{ name: 'Major Pairs', payout_limit: 20000, profile_name: 'medium_risk', turnover_limit: 100000 }],
    };
    it('should render AccountLimitsTurnoverLimitRow component', () => {
        render(<AccountLimitsTurnoverLimitRowComponent {...props} />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.queryByTestId('account-limits-turnover-limit-row')).toBeInTheDocument();
    });

    it('should return null if collection is empty array', () => {
        render(<AccountLimitsTurnoverLimitRowComponent />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.queryByTestId('account-limits-turnover-limit-row')).not.toBeInTheDocument();
    });

    it('should display title and item name', () => {
        render(<AccountLimitsTurnoverLimitRowComponent {...props} title='Forex' />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.getByText(/Forex - Major Pairs/i)).toBeInTheDocument();
    });

    it('should call formatMoney function', () => {
        render(<AccountLimitsTurnoverLimitRowComponent {...props} />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });

        expect(formatMoney).toHaveBeenCalledWith('AUD', 100000, true);
    });
});
