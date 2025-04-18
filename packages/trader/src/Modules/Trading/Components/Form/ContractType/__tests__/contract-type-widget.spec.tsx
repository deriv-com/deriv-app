import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeWidget from '../contract-type-widget';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';

const mock_connect_props = {
    modules: {
        trade: {
            symbol: 'R_100',
        },
    },
    active_symbols: { active_symbols: [] },
    ui: { is_mobile: false },
};

describe('<ContractTypeWidget />', () => {
    const list = [
        {
            contract_types: [
                {
                    text: 'Multipliers',
                    value: TRADE_TYPES.MULTIPLIER,
                },
            ],
            icon: 'IcMultiplier',
            label: 'Multipliers',
            key: 'Multipliers',
        },
        {
            contract_types: [
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL_EQUAL,
                },
            ],
            icon: 'IcUpsDowns',
            label: 'Ups & Downs',
            key: 'Options',
        },
        {
            contract_types: [
                {
                    text: 'Higher/Lower',
                    value: TRADE_TYPES.HIGH_LOW,
                },
                {
                    text: 'Touch/No Touch',
                    value: TRADE_TYPES.TOUCH,
                },
            ],
            icon: 'IcHighsLows',
            label: 'Touch & No Touch',
            key: 'Options',
        },
        {
            contract_types: [
                {
                    text: 'Matches/Differs',
                    value: TRADE_TYPES.MATCH_DIFF,
                },
                {
                    text: 'Even/Odd',
                    value: TRADE_TYPES.EVEN_ODD,
                },
                {
                    text: 'Over/Under',
                    value: TRADE_TYPES.OVER_UNDER,
                },
            ],
            icon: 'IcDigits',
            label: 'Digits',
            key: 'Options',
        },
    ];

    const unavailable_trade_types_list = [
        {
            contract_types: [{ text: 'Vanillas', value: 'vanilla' }],
            icon: 'IcVanillas',
            is_unavailable: true,
            key: 'Vanillas',
            label: 'Vanillas',
        },
        {
            contract_types: [{ text: 'Accumulators', value: TRADE_TYPES.ACCUMULATOR }],
            icon: 'IcAccumulators',
            is_unavailable: true,
            key: 'Accumulators',
            label: 'Accumulators',
        },
    ];

    const item = {
        text: 'Multipliers',
        value: TRADE_TYPES.MULTIPLIER,
    };

    const mocked_default_props = {
        name: 'test_name',
        onChange: jest.fn(),
        list,
        unavailable_trade_types_list,
        value: item.value,
    };

    it('should render <ContractTypeMenu /> component when click on ', () => {
        render(<ContractTypeWidget {...mocked_default_props} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });
        expect(screen.getByTestId('dt_contract_widget')).toBeInTheDocument();
    });

    it('should render "Learn about this trade type" phrase', () => {
        render(<ContractTypeWidget {...mocked_default_props} />, {
            wrapper: ({ children }) => (
                <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
            ),
        });

        expect(screen.getByText('Learn about this trade type')).toBeInTheDocument();
    });
});
