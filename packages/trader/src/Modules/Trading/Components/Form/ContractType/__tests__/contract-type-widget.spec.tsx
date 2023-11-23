import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeWidget from '../contract-type-widget';
import { mockStore } from '@deriv/stores';
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
                    value: 'multiplier',
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
                    value: 'rise_fall',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall_equal',
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
                    value: 'high_low',
                },
                {
                    text: 'Touch/No Touch',
                    value: 'touch',
                },
            ],
            icon: 'IcHighsLows',
            label: 'Highs & Lows',
            key: 'Options',
        },
        {
            contract_types: [
                {
                    text: 'Matches/Differs',
                    value: 'match_diff',
                },
                {
                    text: 'Even/Odd',
                    value: 'even_odd',
                },
                {
                    text: 'Over/Under',
                    value: 'over_under',
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
            contract_types: [{ text: 'Accumulators', value: 'accumulator' }],
            icon: 'IcAccumulators',
            is_unavailable: true,
            key: 'Accumulators',
            label: 'Accumulators',
        },
    ];

    const item = {
        text: 'Multipliers',
        value: 'multiplier',
    };

    it('should render <ContractTypeMenu /> component when click on ', () => {
        render(
            <ContractTypeWidget
                name='test_name'
                onChange={jest.fn()}
                list={list}
                unavailable_trade_types_list={unavailable_trade_types_list}
                value={item.value}
            />,
            {
                wrapper: ({ children }) => (
                    <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
                ),
            }
        );
        expect(screen.getByTestId('dt_contract_widget')).toBeInTheDocument();
    });
});
