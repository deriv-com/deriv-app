import React from 'react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, TContractInfo, CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import Purchase from '../purchase';
import TraderProviders from '../../../../trader-providers';

const default_mock_store = {
    modules: {
        trade: {
            basis: '',
            contract_type: TRADE_TYPES.ACCUMULATOR as string,
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
            vanilla_trade_type: CONTRACT_TYPES.VANILLA.CALL,
            trade_types: { CALL: 'Higher', PUT: 'Lower' } as { [key: string]: string },
            is_trade_enabled: true,
        },
    },
};

type TNewMockedProps = typeof default_mock_store &
    Partial<{ portfolio: { active_positions: { contract_info: TContractInfo; type: string }[] } }>;

jest.mock('Modules/Trading/Components/Elements/purchase-fieldset', () =>
    jest.fn(() => <div>PurchaseField component</div>)
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
                active_positions: [
                    { contract_info: mockContractInfo({ underlying: 'test_symbol' }), type: TRADE_TYPES.ACCUMULATOR },
                ],
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

    it('should render only one PurchaseField component if it is TRADE_TYPES.VANILLA.CALL trade type', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules.trade.is_accumulator = false;
        new_mocked_store.modules.trade.is_vanilla = true;
        new_mocked_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        new_mocked_store.modules.trade.trade_types = {
            [CONTRACT_TYPES.VANILLA.CALL]: TRADE_TYPES.VANILLA.CALL,
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
