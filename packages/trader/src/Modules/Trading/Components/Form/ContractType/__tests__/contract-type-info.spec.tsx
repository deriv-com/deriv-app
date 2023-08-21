import React from 'react';
import { screen, render } from '@testing-library/react';
import Info from '../ContractTypeInfo/contract-type-info';
import userEvent from '@testing-library/user-event';

jest.mock('Assets/Trading/Categories/trade-categories-gif', () => jest.fn(() => 'TradeCategoriesGif'));
jest.mock('Assets/Trading/Categories/trade-categories', () => jest.fn(() => 'TradeDescription'));
jest.mock('../ContractTypeInfo/contract-type-glossary', () => jest.fn(() => 'TradeTypeGlossary'));

const mocked_props: React.ComponentProps<typeof Info> = {
    handleSelect: jest.fn(),
    item: {
        text: 'Multipliers',
        value: 'multiplier',
    },
    list: [
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
                    key: 'Multiplier',
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
                    key: 'Ups & Downs',
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
                    key: 'Highs & Lows',
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
                    key: 'Digits',
                },
                {
                    contract_types: [
                        {
                            text: 'Call/Put',
                            value: 'vanilla',
                        },
                    ],
                    icon: 'IcVanilla',
                    label: 'Vanillas',
                    key: 'Vanillas',
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
                {
                    text: 'Call/Put',
                    value: 'vanilla',
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
                            value: 'multiplier',
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
                    value: 'multiplier',
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
                            value: 'rise_fall',
                        },
                        {
                            text: 'Rise/Fall',
                            value: 'rise_fall_equal',
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
                            value: 'high_low',
                        },
                        {
                            text: 'Touch/No Touch',
                            value: 'touch',
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
                    key: 'Digits',
                },
                {
                    contract_types: [
                        {
                            text: 'Call/Put',
                            value: 'vanilla',
                        },
                    ],
                    icon: 'IcVanilla',
                    label: 'Vanillas',
                    key: 'Vanillas',
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
                {
                    text: 'Call/Put',
                    value: 'vanilla',
                },
            ],
            icon: 'IcCatOptions',
            label: 'Options',
            key: 'Options',
        },
    ],
};

describe('<Info />', () => {
    it('Should render only one "Choose Multipliers" button', () => {
        render(<Info {...mocked_props} />);
        const trade_type_button = screen.queryByText('Choose Multipliers');
        expect(trade_type_button).toBeInTheDocument();
    });
    it('Should call handleSelect when clicking on "Choose Multipliers" button', () => {
        render(<Info {...mocked_props} />);
        const trade_type_button = screen.queryByText('Choose Multipliers') as HTMLButtonElement;
        userEvent.click(trade_type_button);
        expect(trade_type_button).toBeInTheDocument();
        expect(mocked_props.handleSelect).toHaveBeenCalled();
    });
    it('Should render toggle buttons if vanilla info page is open', () => {
        mocked_props.item.text = 'Call/Put';
        mocked_props.item.value = 'vanilla';
        render(<Info {...mocked_props} />);
        const trade_type_button = screen.getByText('Choose Call/Put');
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText(/glossary/i)).toBeInTheDocument();
        expect(trade_type_button).toBeInTheDocument();
    });
});
