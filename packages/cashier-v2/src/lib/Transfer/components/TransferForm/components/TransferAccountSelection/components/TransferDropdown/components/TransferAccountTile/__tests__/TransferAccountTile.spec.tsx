import React from 'react';
import { render, screen } from '@testing-library/react';
import TransferAccountTile from '../TransferAccountTile';

jest.mock('../../../../../../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../../../../../../components'),
    CurrencyIcon: jest.fn(({ currency, size }) => (
        <span>
            CurrencyIcon-{currency}-{size}
        </span>
    )),
    TradingAppIcon: jest.fn(({ name, size }) => (
        <span>
            TradingAppIcon-{name}-{size}
        </span>
    )),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

const mockMT5Account = {
    account_type: 'mt5',
    currency: 'USD',
    loginid: 'CR1',
};

const mockDerivXAccount = {
    account_type: 'dxtrade',
    currency: 'USD',
    loginid: 'CR2',
};

const mockCurrencyAccount = {
    account_type: 'binary',
    currency: 'BTC',
    loginid: 'CR3',
};

describe('<TransferAccountTile />', () => {
    it('should check if the correct account icon is displayed for MT5 accounts', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferAccountTile account={mockMT5Account} />);
        expect(screen.getByText('TradingAppIcon-DMT5_DERIVED-sm')).toBeInTheDocument();
    });

    it('should check if the correct account icon is displayed for Deriv X accounts', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferAccountTile account={mockDerivXAccount} />);
        expect(screen.getByText('TradingAppIcon-DERIVX-sm')).toBeInTheDocument();
    });

    it('should check if the correct account icon is displayed for currency accounts', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferAccountTile account={mockCurrencyAccount} />);
        expect(screen.getByText('CurrencyIcon-BTC-sm')).toBeInTheDocument();
    });
});
