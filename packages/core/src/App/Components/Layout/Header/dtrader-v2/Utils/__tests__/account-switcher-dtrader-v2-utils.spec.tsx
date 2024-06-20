import React from 'react';
import { render, screen } from '@testing-library/react';
import { getAccountTitle, getAccountIcon } from '../account-switcher-dtrader-v2-utils';

const mock_currency_none_icon = 'currencyNoneIcon';
const mock_currency_demo_icon = 'CurrencyDemoIcon';
const mock_currency_usd_icon = 'CurrencyUsdIcon';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    CurrencyNoneIcon: jest.fn(() => mock_currency_none_icon),
    CurrencyDemoIcon: jest.fn(() => mock_currency_demo_icon),
    CurrencyUsdIcon: jest.fn(() => mock_currency_usd_icon),
}));

describe('getAccountTitle', () => {
    const mockArgs = {
        currency: '',
        loginid: 'VRTC90000884',
        is_virtual: false,
        show_no_currency: true,
    };

    it('should return "Multipliers" if loginid contains MF', () => {
        render(getAccountTitle({ ...mockArgs, loginid: 'MF90000884' }));

        expect(screen.getByText('Multipliers')).toBeInTheDocument();
    });

    it('should return "Demo" if loginid does not contain MF and is_virtual === true', () => {
        render(getAccountTitle({ ...mockArgs, is_virtual: true }));

        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should return "No currency assigned" if loginid does not contain MF, is_virtual and currency are falsy and show_no_currency is true', () => {
        render(getAccountTitle(mockArgs));

        expect(screen.getByText('No currency assigned')).toBeInTheDocument();
    });

    it('should return users loginid if loginid does not contain MF, is_virtual and currency are falsy and show_no_currency is false', () => {
        expect(getAccountTitle({ ...mockArgs, show_no_currency: false })).toBe('VRTC90000884');
    });

    it('should return currency name if loginid does not contain MF, is_virtual and show_no_currency are falsy and there is currency', () => {
        expect(getAccountTitle({ ...mockArgs, currency: 'USDT' })).toBe('Tether Omni');
    });
});

describe('getAccountIcon', () => {
    const mockArgs: Parameters<typeof getAccountIcon>[0] = {
        currency: 'USD',
        is_virtual: false,
        size: 'sm',
    };

    it('should return CurrencyDemoIcon icon if is_virtual === true', () => {
        render(getAccountIcon({ ...mockArgs, is_virtual: true }));

        expect(screen.getByText(mock_currency_demo_icon)).toBeInTheDocument();
    });

    it('should return CurrencyNoneIcon icon if currency is falsy', () => {
        render(getAccountIcon({ ...mockArgs, currency: '' }));

        expect(screen.getByText(mock_currency_none_icon)).toBeInTheDocument();
    });

    it('should return specific for passed currency icon', () => {
        render(getAccountIcon({ ...mockArgs, currency: 'USD' }));

        expect(screen.getByText(mock_currency_usd_icon)).toBeInTheDocument();
    });

    it('should return CurrencyNoneIcon icon if currency is not supported', () => {
        render(getAccountIcon({ ...mockArgs, currency: 'KateCoin' }));

        expect(screen.getByText(mock_currency_none_icon)).toBeInTheDocument();
    });
});
