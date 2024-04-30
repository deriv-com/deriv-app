import React from 'react';
import { render, screen } from '@testing-library/react';
import TransferAccountIcon from '../TransferAccountIcon';

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    CurrencyIcon: jest.fn(({ currency, size }) => (
        <div>
            CurrencyIcon-{currency}-{size}
        </div>
    )),
    TradingAppIcon: jest.fn(({ name, size }) => (
        <div>
            TradingAppIcon-{name}-{size}
        </div>
    )),
}));

describe('<TransferAccountIcon />', () => {
    it('should display the correct currency icon for deriv accounts', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferAccountIcon account={{ account_type: 'binary', currency: 'BTC' }} />);

        expect(screen.getByText('CurrencyIcon-BTC-md')).toBeInTheDocument();
    });

    it('should display the correct MT5 icon for MT5 app', () => {
        render(
            <TransferAccountIcon
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                account={{
                    account_type: 'mt5',
                    currency: 'USD',
                    mt5_group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
                }}
            />
        );

        expect(screen.getByText('TradingAppIcon-DMT5_DERIVED-md')).toBeInTheDocument();
    });

    it('should display the correct Deriv X icon for Deriv X app', () => {
        render(
            <TransferAccountIcon
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                account={{
                    account_type: 'dxtrade',
                    currency: 'USD',
                }}
            />
        );

        expect(screen.getByText('TradingAppIcon-DERIVX-md')).toBeInTheDocument();
    });
});
