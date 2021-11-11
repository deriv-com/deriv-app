import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContractTypeMenu from '../ContractTypeMenu';
import ContractTypeWidget from '../contract-type-widget';

describe('ContractTypeMenu', () => {
    const categories = [
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Multipliers',
                            value: 'multiplier',
                        },
                    ],
                    icon: 'IcMultiplier',
                    label: 'Multiplier',
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
                },
            ],
            contract_types: [
                {
                    text: 'Multipliers',
                    value: 'multiplier',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall_equal',
                },
                {
                    text: 'Higher/Lower',
                    value: 'high_low',
                },
                {
                    text: 'Touch/No Touch',
                    value: 'touch',
                },
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
            icon: 'IcCatAll',
            label: 'All',
        },
        {
            contract_categories: [
                {
                    contract_types: [
                        {
                            text: 'Multipliers',
                            value: 'multiplier',
                        },
                    ],
                    icon: 'IcMultiplier',
                    label: 'Multiplier',
                },
            ],
            contract_types: [
                {
                    text: 'Multipliers',
                    value: 'multiplier',
                },
            ],
            icon: 'IcCatMultiplier',
            label: 'Multipliers',
        },
        {
            contract_categories: [
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
                },
            ],
            contract_types: [
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall',
                },
                {
                    text: 'Rise/Fall',
                    value: 'rise_fall_equal',
                },
                {
                    text: 'Higher/Lower',
                    value: 'high_low',
                },
                {
                    text: 'Touch/No Touch',
                    value: 'touch',
                },
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
            icon: 'IcCatOptions',
            label: 'Options',
        },
    ];

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
        },
    ];

    const item = {
        text: 'Multipliers',
        value: 'multiplier',
    };

    it('should not show <ContractTypeMenu /> component when it is closed', () => {
        render(<ContractTypeMenu item={item} list={list} categories={categories} />);
        expect(screen.queryByTestId('contract_wrapper')).toBe(null);
    });

    it('should render <ContractTypeMenu /> component when click on ', () => {
        render(<ContractTypeWidget list={list} value={item.value} />);
        const dt_contract_dropdown = screen.getByTestId('dt_contract_dropdown');
        fireEvent.click(dt_contract_dropdown);

        expect(screen.getByTestId('contract_wrapper')).toBeInTheDocument();
    });

    it('should search in the input', () => {
        const searchMock = jest.fn();
        render(
            <ContractTypeMenu
                item={item}
                list={list}
                categories={categories}
                is_open={true}
                onChangeInput={searchMock}
            />
        );
        const input = screen.getByPlaceholderText('Search');
        fireEvent.change(input, { target: { value: 'rise' } });
        expect(input.value).toBe('rise');
    });
});
