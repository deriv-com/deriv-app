import * as React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';
import { CONTRACT_TYPES, LocalStore, WS } from '@deriv/shared';
import Trade from 'Modules/Trading';
import { useTraderStore } from 'Stores/useTraderStores';
import { BrowserRouter } from 'react-router-dom';
import { ActiveSymbols } from '@deriv/api-types';
import ReactDOM from 'react-dom';

const default_mocked_store = mockStore({
    client: { is_logged_in: true },
    common: { network_status: { class: 'online' } },
    ui: { notification_messages_ui: 'address' },
    modules: {
        trade: {
            basis: 'stake',
            basis_list: [{ text: 'Payout', value: 'payout' }],
            contract_type: 'rise_fall',
            is_turbos: false,
            is_vanilla: false,
            onChangeMultiple: jest.fn(),
            form_components: ['test'],
            amount: 10,
            duration_unit: 'm',
            is_chart_loading: false,
            getFirstOpenMarket: jest.fn(),
            is_market_closed: false,
            is_trade_enabled: true,
            should_show_active_symbols_loading: false,
            duration: 3,
            stake_boundary: { [CONTRACT_TYPES.TURBOS.LONG]: { min_stake: 1, max_stake: 10000 } } as ReturnType<
                typeof useTraderStore
            >['stake_boundary'],
            show_digits_stats: true,
            is_accumulator: false,
            symbol: 'HV1',
            is_synthetics_available: false,
            is_synthetics_trading_market_available: false,
            onChange: jest.fn(),
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            prepareTradeStore: jest.fn(),
            setContractTypes: jest.fn(),
            setMobileDigitView: jest.fn(),
            setIsDigitsWidgetActive: jest.fn(),
            wsSendRequest: jest.fn(() => WS.storage.send([])),
            active_symbols: [{ symbol: 'R_10', pip: 2 }] as ActiveSymbols,
        },
    },
});

jest.mock('App/Components/Elements/chart-loader', () => jest.fn(() => <div>Chart Loader</div>));
jest.mock('Assets/SvgComponents/launch/ic-chart-launch.svg', () => jest.fn(() => <div>Chart Svg</div>));
jest.mock('Assets/SvgComponents/launch/ic-chart-launch-dark.svg', () => jest.fn(() => <div>Chart Svg</div>));
jest.mock('Modules/Trading/Components/Form/form-layout', () => jest.fn(() => <div>Chart Form Layout</div>));
jest.mock('App/Components/Elements/market-is-closed-overlay', () => jest.fn(() => <div>MarketIsClosedOverlay</div>));
jest.mock('Modules/Trading/Containers/smart-chart-switcher.jsx', () => jest.fn(() => <div>Switcher</div>));

const renderTradeComponent = () => {
    render(
        <BrowserRouter>
            <TraderProviders store={default_mocked_store}>
                <Trade />
            </TraderProviders>
        </BrowserRouter>
    );
};

describe('Launch Modal', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    beforeEach(() => {
        LocalStore.remove('launchModalShown');
    });

    it('should display launch modal for a logged in user', () => {
        renderTradeComponent();
        expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
    });

    it('should set the localStorage key launchModalShown to true on clicking the continue button', async () => {
        renderTradeComponent();
        expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
        const continue_btn = screen.getByRole('button', { name: 'Continue' });
        userEvent.click(continue_btn);
        const value = JSON.parse(LocalStore.get('launchModalShown') ?? 'false');
        expect(value).toBe(true);
    });

    it('should not display launch modal for a not logged in user', () => {
        default_mocked_store.client.is_logged_in = false;
        renderTradeComponent();
        expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
    });

    it('should not show the launch modal once localStorage flag launchModalShown is set', async () => {
        LocalStore.set('launchModalShown', JSON.stringify(true));
        renderTradeComponent();
        expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
    });
});
