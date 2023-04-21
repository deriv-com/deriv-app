import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierOnboardingTitle from '../cashier-onboarding-title';

describe('CashierOnboardingTitle', () => {
    test('should render cashier onboarding title', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingTitle />, { wrapper });

        const title = screen.queryByTestId('dt_cashier_onboarding_title');

        expect(title).toBeInTheDocument();
    });

    test('should not render learn more link on desktop', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingTitle />, { wrapper });

        const learn_more = screen.queryByTestId('dt_cashier_onboarding_title_learn_more');

        expect(learn_more).not.toBeInTheDocument();
    });

    test('should render cashier onboarding title with learn more link when on mobile', async () => {
        const mock = mockStore({ ui: { is_mobile: true } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingTitle />, { wrapper });

        const learn_more = screen.queryByTestId('dt_cashier_onboarding_title_learn_more');

        expect(learn_more).toBeInTheDocument();
    });

    test('should not learn more link when on mobile and is from DerivGO', async () => {
        const mock = mockStore({ ui: { is_mobile: true }, common: { is_from_derivgo: true } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingTitle />, { wrapper });

        const learn_more = screen.queryByTestId('dt_cashier_onboarding_title_learn_more');

        expect(learn_more).not.toBeInTheDocument();
    });
});
