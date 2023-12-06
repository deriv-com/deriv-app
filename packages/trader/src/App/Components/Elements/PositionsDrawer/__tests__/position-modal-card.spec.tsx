import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import { ActiveSymbols } from '@deriv/api-types';
import PositionsModalCard from '../positions-modal-card';
import TraderProviders from '../../../../../trader-providers';

const default_mock_props: React.ComponentProps<typeof PositionsModalCard> = {
    className: 'test_className',
    contract_info: mockContractInfo({
        contract_type: TRADE_TYPES.VANILLA.CALL,
        underlying: '',
        contract_id: 123386875,
        currency: 'USD',
        buy_price: 2671,
        bid_price: 2517,
        entry_spot: 2666.0,
        barrier: '2650.0',
        is_sold: 0,
        date_start: 123532989,
        date_expiry: 626512765,
        tick_count: 15,
    }),
    contract_update: {},
    currency: 'USD',
    current_tick: 6,
    id: 123386875,
    indicative: 23.45,
    is_loading: false,
    is_sell_requested: false,
    is_unsupported: true,
    onClickSell: jest.fn(),
    profit_loss: 35.6786,
    onClickCancel: jest.fn(),
    togglePositions: jest.fn(),
    toggleUnsupportedContractModal: jest.fn(),
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [{ symbol: 'R_10' }] as ActiveSymbols,
        },
    },
    ui: {
        addToast: jest.fn(),
        current_focus: '',
        is_mobile: true,
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        should_show_cancellation_warning: false,
        toggleCancellationWarning: jest.fn(),
    },
    common: {
        server_time: moment('2023-11-21 10:59:59'),
    },
    contract_trade: {
        getContractById: jest.fn(),
    },
};
const PositionsCardLoader = 'PositionsCardLoader';
const SymbolDisplayName = 'SymbolDisplayName';

jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    PositionsCardLoader: jest.fn(() => <div>{PositionsCardLoader}</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getEndTime: jest.fn(() => false),
    getTotalProfit: jest.fn(() => 35.6786),
    getSymbolDisplayName: jest.fn(() => SymbolDisplayName),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    NavLink: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('App/Components/Routes', () => ({
    ...jest.requireActual('App/Components/Routes'),
    BinaryLink: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    CurrencyBadge: jest.fn(() => <div>CurrencyBadge</div>),
    ProgressSliderMobile: jest.fn(() => <div>ProgressSliderMobile</div>),
}));

describe('<PositionsModalCard />', () => {
    const mockPositionsModalCard = (
        mocked_store: TCoreStores,
        mocked_params: React.ComponentProps<typeof PositionsModalCard>
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <PositionsModalCard {...mocked_params} />
            </TraderProviders>
        );
    };

    it('should render loader if underlying in contract_info is falsy and contract is unsupported', () => {
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(PositionsCardLoader)).toBeInTheDocument();
    });
    it('should render loader if underlying in contract_info is falsy and contract is supported', () => {
        default_mock_props.is_unsupported = false;
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.getByText(PositionsCardLoader)).toBeInTheDocument();
    });
    it('should render specific contract card for Vanillas', () => {
        default_mock_props.contract_info.underlying = 'test_underlying';
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.queryByText(PositionsCardLoader)).not.toBeInTheDocument();
        expect(screen.getByText(SymbolDisplayName)).toBeInTheDocument();
        expect(screen.getByText('CurrencyBadge')).toBeInTheDocument();
        expect(screen.getByText(/Buy price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,671.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Contract value:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,517.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Entry spot:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,666/i)).toBeInTheDocument();
        expect(screen.getByText(/Strike:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,650.0/i)).toBeInTheDocument();
        expect(screen.getByText('ProgressSliderMobile')).toBeInTheDocument();
        expect(screen.getByText(/Total profit\/loss:/i)).toBeInTheDocument();
        expect(screen.getByText(/35.68/i)).toBeInTheDocument();
    });
    it('should render specific contract card for Turbos', () => {
        default_mock_props.contract_info.contract_type = TRADE_TYPES.TURBOS.LONG;
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.queryByText(PositionsCardLoader)).not.toBeInTheDocument();
        expect(screen.getByText(SymbolDisplayName)).toBeInTheDocument();
        expect(screen.getByText('Long')).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,671.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Contract value:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,517.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Entry spot:/i)).toBeInTheDocument();
        expect(screen.getByText(/Take profit:/i)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText(/Barrier:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,650.0/i)).toBeInTheDocument();
    });
    it('should render contract card for Rise/Fall', () => {
        default_mock_props.contract_info.contract_type = TRADE_TYPES.RISE_FALL;
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.queryByText(PositionsCardLoader)).not.toBeInTheDocument();
        expect(screen.getByText(SymbolDisplayName)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/Potential profit\/loss:/i)).toBeInTheDocument();
        expect(screen.getByText(/Indicative price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,517.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,671.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Payout limit:/i)).toBeInTheDocument();
    });
    it('should render the same contract card for Touch/No Touch as for Rise/Fall', () => {
        default_mock_props.contract_info.contract_type = TRADE_TYPES.TOUCH;
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.queryByText(PositionsCardLoader)).not.toBeInTheDocument();
        expect(screen.getByText(SymbolDisplayName)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/Potential profit\/loss:/i)).toBeInTheDocument();
        expect(screen.getByText(/Indicative price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,517.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,671.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Payout limit:/i)).toBeInTheDocument();
    });
    it('should render the contract card for Multipliers', () => {
        default_mock_props.contract_info.contract_type = TRADE_TYPES.MULTIPLIER;
        render(mockPositionsModalCard(mockStore(default_mock_store), default_mock_props));

        expect(screen.queryByText(PositionsCardLoader)).not.toBeInTheDocument();
        expect(screen.getByText(SymbolDisplayName)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
        expect(screen.getByText('Stake:')).toBeInTheDocument();
        expect(screen.getByText(/Current stake:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,517.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Deal cancel. fee:/i)).toBeInTheDocument();
        expect(screen.getByText(/Buy price:/i)).toBeInTheDocument();
        expect(screen.getByText(/Take profit:/i)).toBeInTheDocument();
        expect(screen.getByText(/Stop loss:/i)).toBeInTheDocument();
        expect(screen.getByText(/Total profit\/loss:/i)).toBeInTheDocument();
    });
});
