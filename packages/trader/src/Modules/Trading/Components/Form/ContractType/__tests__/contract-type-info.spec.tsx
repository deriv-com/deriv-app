import React from 'react';
import { screen, render } from '@testing-library/react';
import Info from '../ContractTypeInfo/contract-type-info';
import userEvent from '@testing-library/user-event';

jest.mock('Assets/Trading/Categories/trade-categories-gif.jsx', () => jest.fn(() => 'TradeCategoriesGif'));
jest.mock('Assets/Trading/Categories/trade-categories.jsx', () => jest.fn(() => 'TradeCategories'));

const mocked_props: React.ComponentProps<typeof Info> = {
    handleNavigationClick: jest.fn(),
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
            key: 'Options',
        },
    ],
};

describe('<Info />', () => {
    it('Should render only one "Choose Rise/Fall" button', () => {
        render(<Info {...mocked_props} />);
        const rise_fall_button = screen.queryAllByText('Choose Rise/Fall');
        expect(rise_fall_button).not.toHaveLength(2);
    });
    it('Should render 7 buttons, 7 Gifs, and 7 trade categories even though there are 8 trade types', () => {
        render(<Info {...mocked_props} />);
        expect(screen.getAllByText(/choose/i)).toHaveLength(7);
        expect(screen.getAllByText(/tradecategoriesgif/i)).toHaveLength(7);
        expect(screen.getAllByText('TradeCategories')).toHaveLength(7);
    });
    it('should do something', () => {
        render(<Info {...mocked_props} />);
        const rise_fall_button = screen.getByText('Choose Rise/Fall');
        userEvent.click(rise_fall_button);
        expect(mocked_props.handleSelect).toHaveBeenCalled();
    });
});
