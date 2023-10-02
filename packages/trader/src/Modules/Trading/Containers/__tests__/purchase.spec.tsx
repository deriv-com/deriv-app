import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import Purchase from '../purchase';

const default_mock_store = {
    modules: {
        trade: {
            basis: '',
            contract_type: 'accumulator',
            currency: '',
            is_accumulator: false,
            is_multiplier: false,
            growth_rate: 0.03,
            has_cancellation: false,
            has_open_accu_contract: false,
            is_purchase_enabled: false,
            is_turbos: false,
            is_vanilla: false,
            onPurchase: jest.fn(),
            onHoverPurchase: jest.fn(),
            proposal_info: { CALL: { id: '123', message: 'test_message', has_error: true } },
            purchase_info: {},
            symbol: 'test_symbol',
            validation_errors: {},
            vanilla_trade_type: 'VANILLALONGCALL',
            trade_types: { CALL: 'Higher', PUT: 'Lower' } as { [key: string]: string },
            is_trade_enabled: true,
        },
    },
};

type TNewMockedProps = typeof default_mock_store &
    Partial<{ portfolio: { active_positions: { contract_info: { underlying: string }; type: string }[] } }>;

jest.mock('Modules/Trading/Components/Elements/purchase-fieldset', () =>
    jest.fn(() => <div>PurchaseField component</div>)
);
jest.mock('Modules/Trading/Components/Elements/purchase-buttons-overlay.jsx', () =>
    jest.fn(() => <div>PurchaseButtonsOverlay component</div>)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-sell-button', () =>
    jest.fn(() => <div>Accu sell button</div>)
);

describe('<Purchase />', () => {
    const mockPurchaseModal = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <Purchase is_market_closed={false} />
            </TraderProviders>
        );
    };

    it('should render 2 PurchaseField components if it is Rise/Fall trade type', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockPurchaseModal(mock_root_store));

        expect(screen.getAllByText(/PurchaseField component/i)).toHaveLength(2);
    });

    it('should render Sell button if accumulator contract is already in active positions', () => {
        const new_mocked_store: TNewMockedProps = {
            ...default_mock_store,
            portfolio: {
                active_positions: [{ contract_info: { underlying: 'test_symbol' }, type: 'accumulator' }],
            },
        };
        new_mocked_store.modules.trade.trade_types = { ACCU: 'Accumulator Up' };
        new_mocked_store.modules.trade.is_accumulator = true;
        new_mocked_store.modules.trade.has_open_accu_contract = true;
        const mock_root_store = mockStore(new_mocked_store);
        render(mockPurchaseModal(mock_root_store));

        expect(screen.queryByText(/PurchaseField component/i)).not.toBeInTheDocument();
        expect(screen.getByText(/accu sell button/i)).toBeInTheDocument();
    });

    it('should render only one PurchaseField component if it is vanilla trade type', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules.trade.is_accumulator = false;
        new_mocked_store.modules.trade.is_vanilla = true;
        new_mocked_store.modules.trade.contract_type = 'vanilla';
        new_mocked_store.modules.trade.trade_types = {
            VANILLA: 'Vanilla Long Call',
        };
        const mock_root_store = mockStore(new_mocked_store);
        render(mockPurchaseModal(mock_root_store));

        expect(screen.getByText(/PurchaseField component/i)).toBeInTheDocument();
    });

    it('should not render PurchaseField component if trade type does not exist', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules.trade.contract_type = 'test_type';
        new_mocked_store.modules.trade.trade_types = {
            test_type: 'test_type',
        };
        new_mocked_store.modules.trade.validation_errors = { test: 'test_error' };
        const mock_root_store = mockStore(new_mocked_store);
        render(mockPurchaseModal(mock_root_store));

        expect(screen.queryByText(/PurchaseField component/i)).not.toBeInTheDocument();
    });
});
