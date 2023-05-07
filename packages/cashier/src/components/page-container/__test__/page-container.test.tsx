import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import PageContainer from '../page-container';

describe('PageContainer', () => {
    test('should show loading if is_authorize is false', () => {
        const mock = mockStore({ client: { is_authorize: false } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
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
        const mock = mockStore({ client: { is_authorize: true } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
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
