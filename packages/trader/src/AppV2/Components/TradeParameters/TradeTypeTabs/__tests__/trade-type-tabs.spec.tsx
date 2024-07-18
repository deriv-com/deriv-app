import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import { ReportsStoreProvider } from '../../../../../../../reports/src/Stores/useReportsStores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TradeTypeTabs from '../trade-type-tabs';

describe('TradeTypeTabs', () => {
    let defaultMockStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        defaultMockStore = mockStore({});
    });

    const mockTradeTypeTabs = (props?: React.ComponentProps<typeof TradeTypeTabs>) => {
        return (
            <TraderProviders store={defaultMockStore}>
                <ReportsStoreProvider>
                    <ModulesProvider store={defaultMockStore}>
                        <TradeTypeTabs {...props} />
                    </ModulesProvider>
                </ReportsStoreProvider>
            </TraderProviders>
        );
    };

    it('should not render component if contract type is not Vanillas or Turbos', () => {
        const { container } = render(mockTradeTypeTabs());

        expect(container).toBeEmptyDOMElement();
    });

    it('should render correct tabs name for Vanillas', () => {
        defaultMockStore.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        render(mockTradeTypeTabs({ is_minimized: true }));

        expect(screen.getByText('Call')).toBeInTheDocument();
        expect(screen.getByText('Put')).toBeInTheDocument();

        userEvent.click(screen.getByText('Put'));
    });

    it('should call onChange function if user clicks on another tab and not call it if he clicks on the already chosen one', () => {
        defaultMockStore.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        render(mockTradeTypeTabs());

        const current_tab = screen.getByText('Up');
        const another_tab = screen.getByText('Down');
        expect(defaultMockStore.modules.trade.onChange).not.toBeCalled();
        userEvent.click(current_tab);
        expect(defaultMockStore.modules.trade.onChange).not.toBeCalled();

        userEvent.click(another_tab);
        expect(defaultMockStore.modules.trade.onChange).toBeCalled();
    });
});
