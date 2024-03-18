import React, { ComponentProps, PropsWithChildren } from 'react';
import { act, render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import Trader from '../trade';
import TraderProviders from '../../../../trader-providers';
import { isDesktop, isMobile } from '@deriv/shared';
import ChartLoader from 'App/Components/Elements/chart-loader';
import { Div100vhContainer } from '@deriv/components';

jest.mock('App/Components/Elements/PositionsDrawer', () => jest.fn(() => <div>PositionsDrawer</div>));
jest.mock('../trade-chart', () => jest.fn(() => <div>TradeChart</div>));
jest.mock('../../Components/Form/form-layout', () => jest.fn(() => <div>FormLayout</div>));
jest.mock('App/Components/Elements/chart-loader', () =>
    jest.fn(({ is_visible }: ComponentProps<typeof ChartLoader>) => (is_visible ? <div>ChartLoader</div> : null))
);
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Div100vhContainer: ({
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        is_disabled,
        ...props
    }: PropsWithChildren<ComponentProps<typeof Div100vhContainer>>) => {
        return (
            <div {...props} data-testid='dt_div100vhcontainer'>
                {children}
            </div>
        );
    },
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    TRADE_TYPES: jest.fn(),
}));

const rootStore = mockStore({
    ui: {
        notification_messages_ui: 'div',
        is_mobile: false,
    },
    modules: {
        trade: {
            contract_type: 'CALL',
            form_components: [],
            getFirstOpenMarket: jest.fn(),
            has_barrier: false,
            is_accumulator: false,
            is_chart_loading: false,
            is_market_closed: false,
            is_synthetics_available: false,
            is_synthetics_trading_market_available: false,
            is_trade_enabled: true,
            is_trade_params_expanded: false,
            is_turbos: false,
            is_vanilla: false,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            prepareTradeStore: jest.fn(),
            setIsDigitsWidgetActive: jest.fn(),
            setMobileDigitView: jest.fn(),
            should_show_active_symbols_loading: false,
            show_digits_stats: true,
            symbol: 'symbol',
        },
    },
});

describe('Trader', () => {
    beforeEach(() => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        jest.clearAllMocks();
    });

    it('renders the trader component in desktop view', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.getByText('PositionsDrawer')).toBeInTheDocument();
        expect(screen.getByText('TradeChart')).toBeInTheDocument();
        expect(screen.getByText('FormLayout')).toBeInTheDocument();
    });

    it('renders the trader component in mobile view', () => {
        rootStore.ui.is_mobile = true;
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.queryByText('PositionsDrawer')).not.toBeInTheDocument();
        expect(screen.getByText('TradeChart')).toBeInTheDocument();
        expect(screen.getByText('FormLayout')).toBeInTheDocument();
    });

    it('should show market is closed overlay', () => {
        rootStore.modules.trade.is_market_closed = true;
        rootStore.modules.trade.has_only_forward_starting_contracts = false;
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.getByText('This market is closed')).toBeInTheDocument();
    });

    it('should call unmount and onMount when component is mounted and unmounted', () => {
        const onMount = jest.fn();
        const onUnmount = jest.fn();
        rootStore.modules.trade.onMount = onMount;
        rootStore.modules.trade.onUnmount = onUnmount;
        const { unmount } = render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(onMount).toBeCalledTimes(1);
        unmount();
        expect(onUnmount).toBeCalledTimes(1);
    });

    it('should render chart loader when chart is loading', () => {
        rootStore.modules.trade.is_chart_loading = true;
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.getByText('ChartLoader')).toBeInTheDocument();
    });

    it('should not render chart loader when chart is not loading', () => {
        rootStore.modules.trade.is_chart_loading = false;
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.queryByText('ChartLoader')).not.toBeInTheDocument();
    });

    it('should have correct height offset for div100vhcontainer for accumulator', () => {
        rootStore.modules.trade.is_accumulator = true;
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_div100vhcontainer')).toHaveAttribute('height_offset', '295px');
    });

    it('should not have height offset for div100vhcontainer for turbos', () => {
        rootStore.modules.trade.is_accumulator = false;
        rootStore.modules.trade.is_turbos = true;
        render(
            <StoreProvider store={mockStore({})}>
                <TraderProviders store={rootStore}>
                    <Trader />
                </TraderProviders>
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_div100vhcontainer')).toHaveAttribute('height_offset', '300px');
    });

    it('should set category and subcategory when component is mounted', async () => {
        rootStore.modules.trade.getFirstOpenMarket = jest.fn(() => ({
            category: 'category',
            subcategory: 'subcategory',
        }));
        await act(async () => {
            render(
                <StoreProvider store={mockStore({})}>
                    <TraderProviders store={rootStore}>
                        <Trader />
                    </TraderProviders>
                </StoreProvider>
            );
        });
        expect(rootStore.modules.trade.getFirstOpenMarket).toBeCalledTimes(1);
    });

    it('should be able to click see open markets button in market is closed overlay', async () => {
        rootStore.modules.trade.getFirstOpenMarket = jest.fn(() => ({
            category: 'category',
            subcategory: 'subcategory',
        }));
        await act(async () => {
            render(
                <StoreProvider store={mockStore({})}>
                    <TraderProviders store={rootStore}>
                        <Trader />
                    </TraderProviders>
                </StoreProvider>
            );

            const seeOpenMarketsButton = screen.getByText('See open markets');
            expect(seeOpenMarketsButton).toBeInTheDocument();
            seeOpenMarketsButton.click();
        });
    });

    it('should be able to click try synthetic indices button in market is closed overlay', async () => {
        rootStore.modules.trade.is_synthetics_trading_market_available = true;
        rootStore.modules.trade.is_synthetics_available = true;
        await act(async () => {
            render(
                <StoreProvider store={mockStore({})}>
                    <TraderProviders store={rootStore}>
                        <Trader />
                    </TraderProviders>
                </StoreProvider>
            );

            const trySyntheticIndicesButton = screen.getByText('Try Synthetic Indices');
            expect(trySyntheticIndicesButton).toBeInTheDocument();
            trySyntheticIndicesButton.click();
        });
    });
});
