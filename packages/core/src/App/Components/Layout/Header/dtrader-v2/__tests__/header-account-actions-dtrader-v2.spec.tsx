import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import HeaderAccountActionsDTraderV2 from '../header-account-actions-dtrader-v2';

jest.mock('../account-actions-dtrader-v2', () => jest.fn(() => 'AccountActionsDTraderV2'));

describe('HeaderAccountActionsDTraderV2', () => {
    it('should render component', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <HeaderAccountActionsDTraderV2 />
            </StoreProvider>
        );

        expect(screen.getByText('AccountActionsDTraderV2')).toBeInTheDocument();
    });
});
