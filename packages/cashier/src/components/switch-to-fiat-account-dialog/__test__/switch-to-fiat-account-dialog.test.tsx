import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CashierProviders from '../../../cashier-providers';
import SwitchToFiatAccountDialog from '../switch-to-fiat-account-dialog';

describe('SwitchToFiatAccountDialog', () => {
    test('should call the onSwitchDone callback when clicked on confirm button', async () => {
        const mock = mockStore({
            client: {
                account_list: [
                    { title: 'BTC', is_virtual: false, loginid: 'CR123' },
                    { title: 'USD', is_virtual: false, loginid: 'CR123' },
                ],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });
        const onSwitchDone = jest.fn();
        const onCancel = jest.fn();

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<SwitchToFiatAccountDialog is_visible onSwitchDone={onSwitchDone} onCancel={onCancel} />, { wrapper });

        const confirm = screen.getByText('Switch account');

        fireEvent.click(confirm);

        await waitFor(() => expect(onSwitchDone).toBeCalledTimes(1));
        expect(onSwitchDone).toBeCalledTimes(1);
    });
});
