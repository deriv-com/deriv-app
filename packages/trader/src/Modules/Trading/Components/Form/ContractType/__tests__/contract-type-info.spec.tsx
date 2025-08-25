import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import Info from '../ContractTypeInfo/contract-type-info';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';

// Mock necessary components
jest.mock('Assets/Trading/Categories/trade-categories-gif', () => jest.fn(() => 'TradeCategoriesGif'));
jest.mock('Assets/Trading/Categories/trade-categories', () => jest.fn(() => 'TradeDescription'));
jest.mock('../ContractTypeInfo/contract-type-glossary', () => jest.fn(() => 'TradeTypeGlossary'));
jest.mock('../../../../Helpers/contract-type', () => ({
    ...jest.requireActual('../../../../Helpers/contract-type'),
    isMajorPairsSymbol: jest.fn(() => true),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Dropdown: jest.fn(() => <div>Dropdown</div>),
}));

// Simple mock store
const mock_store = {
    modules: {
        trade: {
            cached_multiplier_cancellation_list: [],
            symbol: 'test_symbol',
            is_vanilla_fx: false,
        },
    },
    active_symbols: { active_symbols: [] },
    ui: { is_mobile: false, is_dark_mode_on: false },
};

describe('<Info />', () => {
    it('renders the component and handles button click', async () => {
        const handleSelect = jest.fn();

        render(
            <TraderProviders store={mockStore(mock_store)}>
                <Info
                    handleSelect={handleSelect}
                    item={{
                        text: 'Multipliers',
                        value: TRADE_TYPES.MULTIPLIER,
                    }}
                    selected_value={TRADE_TYPES.MULTIPLIER}
                    list={[
                        {
                            contract_categories: [
                                {
                                    contract_types: [
                                        {
                                            text: 'Multipliers',
                                            value: TRADE_TYPES.MULTIPLIER,
                                        },
                                    ],
                                    icon: 'IcMultiplier',
                                    label: 'Multiplier',
                                    key: 'Multiplier',
                                },
                            ],
                            contract_types: [
                                {
                                    text: 'Multipliers',
                                    value: TRADE_TYPES.MULTIPLIER,
                                },
                            ],
                            icon: 'IcCatAll',
                            label: 'All',
                            key: 'All',
                        },
                    ]}
                />
            </TraderProviders>
        );

        // Check if the component renders with the mocked components
        expect(screen.getByText('Choose Multipliers')).toBeInTheDocument();
        expect(screen.getByText('TradeDescription')).toBeInTheDocument();
        expect(screen.getByText('TradeCategoriesGif')).toBeInTheDocument();

        // Test button click
        const button = screen.getByText('Choose Multipliers');
        await userEvent.click(button);
        expect(handleSelect).toHaveBeenCalled();
    });
});
