import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../cashier-providers';
import PageContainer from '../page-container';

describe('PageContainer', () => {
    test('should show loading if is_authorize is false', () => {
        const mock = mockStore({ client: { is_authorize: false } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        render(
            <PageContainer>
                <div>children</div>
            </PageContainer>,
            { wrapper }
        );

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    test('should show children if is_authorize is true', () => {
        const mock = mockStore({
            client: { is_authorize: true },
            modules: { cashier: { general_store: { setIsDeposit: jest.fn() } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        render(
            <PageContainer>
                <div>children</div>
            </PageContainer>,
            { wrapper }
        );

        expect(screen.getByText('children')).toBeInTheDocument();
    });
});
