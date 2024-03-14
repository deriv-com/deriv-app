import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ContractTypeMenu from '../ContractTypeMenu';
import ContractTypeWidget from '../contract-type-widget';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';
import { ActiveSymbols } from '@deriv/api-types';

const mock_connect_props = {
    modules: {
        trade: {
            symbol: 'R_100',
        },
    },
    active_symbols: {
        active_symbols: [
            {
                allow_forward_starting: 1,
                display_name: 'Volatility 100 Index',
                display_order: 2,
                exchange_is_open: 1,
                is_trading_suspended: 0,
                market: 'synthetic_index',
                market_display_name: 'Derived',
                pip: 0.01,
                subgroup: 'synthetics',
                subgroup_display_name: 'Synthetics',
                submarket: 'random_index',
                submarket_display_name: 'Continuous Indices',
                symbol: 'R_100',
                symbol_type: 'stockindex',
            } as ActiveSymbols[0],
        ],
    },
    ui: { is_mobile: false },
};

describe('ContractTypeMenu', () => {
    const categories: React.ComponentProps<typeof ContractTypeMenu>['categories'] = [
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
                    key: 'Ups & Downs',
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
                    label: 'Highs & Lows',
                    key: 'Highs & Lows',
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
                    key: 'Digits',
                },
            ],
            contract_types: [
                {
                    text: 'Multipliers',
                    value: TRADE_TYPES.MULTIPLIER,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL_EQUAL,
                },
                {
                    text: 'Higher/Lower',
                    value: TRADE_TYPES.HIGH_LOW,
                },
                {
                    text: 'Touch/No Touch',
                    value: TRADE_TYPES.TOUCH,
                },
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
            icon: 'IcCatAll',
            label: 'All',
            key: 'All',
        },
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
            icon: 'IcCatMultiplier',
            label: 'Multipliers',
            key: 'Multipliers',
        },
        {
            contract_categories: [
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
                    key: 'Ups & Downs',
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
                    label: 'Highs & Lows',
                    key: 'Highs & Lows',
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
                    key: 'Digits',
                },
            ],
            contract_types: [
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL,
                },
                {
                    text: 'Rise/Fall',
                    value: TRADE_TYPES.RISE_FALL_EQUAL,
                },
                {
                    text: 'Higher/Lower',
                    value: TRADE_TYPES.HIGH_LOW,
                },
                {
                    text: 'Touch/No Touch',
                    value: TRADE_TYPES.TOUCH,
                },
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
            icon: 'IcCatOptions',
            label: 'Options',
            key: 'Options',
        },
    ];

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
            key: 'Ups & Downs',
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
            label: 'Highs & Lows',
            key: 'Highs & Lows',
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
            key: 'Digits',
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
        value: TRADE_TYPES.MULTIPLIER,
    };

    it('should not show <ContractTypeMenu /> component when it is closed', () => {
        render(<ContractTypeMenu item={item} categories={categories} />);
        expect(screen.queryByTestId('contract_wrapper')).not.toBeInTheDocument();
    });

    it('should render <ContractTypeMenu /> component when clicked on', () => {
        render(
            <ContractTypeWidget
                name='test_name'
                list={list}
                value={item.value}
                onChange={jest.fn()}
                unavailable_trade_types_list={unavailable_trade_types_list}
            />,
            {
                wrapper: ({ children }) => (
                    <TraderProviders store={mockStore(mock_connect_props)}>{children}</TraderProviders>
                ),
            }
        );
        const dt_contract_dropdown = screen.getByTestId('dt_contract_dropdown');
        fireEvent.click(dt_contract_dropdown);

        expect(screen.getByTestId('dt_contract_wrapper')).toBeInTheDocument();
        expect(screen.getByText(/Some trade types are unavailable for Volatility 100 Index./i)).toBeInTheDocument();
    });

    it('should search in the input', () => {
        const searchMock = jest.fn();
        render(<ContractTypeMenu item={item} categories={categories} is_open={true} onChangeInput={searchMock} />);
        const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'rise' } });
        expect(input.value).toBe('rise');
    });

    it('should render learn_more_banner if it was passed', () => {
        render(
            <ContractTypeMenu
                item={item}
                categories={categories}
                is_open={true}
                learn_more_banner={<div>Learn more</div>}
            />
        );

        expect(screen.getByText('Learn more')).toBeInTheDocument();
    });
});
