import React from 'react';
import { screen, render } from '@testing-library/react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTurnoverLimitRow from '../account-limits-turnover-limit-row';
import AccountLimitsContext from '../account-limits-context';

jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useContext: () => ({
            currency: 'AUD',
        }),
    };
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatMoney: jest.fn(),
}));
const { currency } = React.useContext(AccountLimitsContext);

describe('<AccountLimitsTurnoverLimitRow/>', () => {
    const props = {
        collection: [{ name: 'Major Pairs', payout_limit: 20000, profile_name: 'medium_risk', turnover_limit: 100000 }],
    };
    it('should render AccountLimitsTurnoverLimitRow component', () => {
        render(<AccountLimitsTurnoverLimitRow {...props} />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.queryByTestId('account-limits-turnover-limit-row')).toBeInTheDocument();
    });

    it('should return null if collection is empty array', () => {
        render(<AccountLimitsTurnoverLimitRow />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.queryByTestId('account-limits-turnover-limit-row')).not.toBeInTheDocument();
    });

    it('should display title and item name', () => {
        render(<AccountLimitsTurnoverLimitRow {...props} title='Forex' />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(screen.getByText('Forex - Major Pairs')).toBeInTheDocument();
    });

    it('should call formatMoney function', () => {
        render(<AccountLimitsTurnoverLimitRow {...props} />, {
            container: document.body.appendChild(document.createElement('tbody')),
        });
        expect(formatMoney).toHaveBeenCalledWith(currency, 100000, true);
    });
});
