import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import { ReportsStoreProvider } from '../../../../../../../reports/src/Stores/useReportsStores';
import TradeTypeTabs from '../trade-type-tabs';

describe('TradeTypeTabs', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({});
    });

    const mockTradeTypeTabs = (props?: React.ComponentProps<typeof TradeTypeTabs>) => {
        return (
            <TraderProviders store={default_mock_store}>
                <ReportsStoreProvider>
                    <ModulesProvider store={default_mock_store}>
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
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        render(mockTradeTypeTabs({ is_minimized: true }));

        expect(screen.getByText('Call')).toBeInTheDocument();
        expect(screen.getByText('Put')).toBeInTheDocument();

        userEvent.click(screen.getByText('Put'));
    });

    it('should call onChange function if user clicks on another tab and not call it if he clicks on the already chosen one', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        render(mockTradeTypeTabs());

        const current_tab = screen.getByText('Up');
        const another_tab = screen.getByText('Down');
        expect(default_mock_store.modules.trade.onChange).not.toBeCalled();
        userEvent.click(current_tab);
        expect(default_mock_store.modules.trade.onChange).not.toBeCalled();

        userEvent.click(another_tab);
        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });

    it('should not call onChange function if user clicks on another tab which has the same trade type as the one already set', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.HIGH_LOW;
        render(mockTradeTypeTabs());

        const another_tab = screen.getByText('Lower');

        userEvent.click(another_tab);
        expect(default_mock_store.modules.trade.onChange).not.toBeCalled();
    });
});
