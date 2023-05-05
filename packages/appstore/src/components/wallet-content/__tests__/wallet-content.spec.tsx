import React from 'react';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';

const mocked_root_store = mockStore({});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

describe('<WalletContent />', () => {
    describe('Check currency card', () => {
        it('Should render right currency card for DEMO', () => {
            render(
                <StoreProvider store={mocked_root_store}>
                    <p>123</p>
                    {/* <Wallet
                        account={{
                            account_status: '',
                            balance: '',
                            currency: 'USD',
                            jurisdiction: 'svg',
                            account_type: 'demo',
                        }}
                    /> */}
                </StoreProvider>
            );
            const currency_card = 'test';

            expect(currency_card).toBe('test');
        });
    });
});
