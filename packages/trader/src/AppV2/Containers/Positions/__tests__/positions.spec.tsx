import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import Positions from '../positions';

const defaultMockStore = mockStore({});

describe('Positions', () => {
    it('should render component', () => {
        render(
            <BrowserRouter>
                <TraderProviders store={defaultMockStore}>
                    <ReportsStoreProvider>
                        <ModulesProvider store={defaultMockStore}>
                            <Positions />
                        </ModulesProvider>
                    </ReportsStoreProvider>
                </TraderProviders>
            </BrowserRouter>
        );

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);

        const openTab = tabs[0];
        const closedTab = tabs[1];
        expect(openTab).toHaveAttribute('aria-selected', 'true');
        expect(closedTab).toHaveAttribute('aria-selected', 'false');

        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByText('Closed')).toBeInTheDocument();
    });
});
