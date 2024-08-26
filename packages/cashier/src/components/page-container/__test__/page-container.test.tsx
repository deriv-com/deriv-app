import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../cashier-providers';
import PageContainer from '../page-container';

describe('PageContainer', () => {
    let mockRootStore: ReturnType<typeof mockStore>, mockProps: React.ComponentProps<typeof PageContainer>;
    beforeEach(() => {
        mockRootStore = mockStore({
            client: { is_authorize: true },
            modules: { cashier: { general_store: { setIsDeposit: jest.fn() } } },
        });

        mockProps = {
            hide_breadcrumb: true,
            left: undefined,
            right: undefined,
        };
    });

    const mockPageContainer = () => (
        <CashierProviders store={mockRootStore}>
            <PageContainer {...mockProps}>children</PageContainer>
        </CashierProviders>
    );

    const renderPageContainer = () => {
        return render(mockPageContainer());
    };

    it('shows loading if is_authorize is false', () => {
        mockRootStore.client.is_authorize = false;
        renderPageContainer();

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('shows children if is_authorize is true', () => {
        renderPageContainer();

        expect(screen.getByText('children')).toBeInTheDocument();
    });
});
