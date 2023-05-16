import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeInfo from '../ContractTypeInfo';

jest.mock('Assets/Trading/Categories/trade-categories-gif.jsx', () => jest.fn(() => 'TradeCategoriesGIF'));

describe('ContractTypeInfo', () => {
    const mocked_props = {
        handleNavigationClick: jest.fn(),
        handleSelect: jest.fn(),
        initial_index: 0,
        item: {
            text: 'Multipliers',
            value: 'multiplier',
        },
        list: [
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
    };

    it('should render <ContractTypeInfo /> component', () => {
        render(<ContractTypeInfo {...mocked_props} />);
        expect(screen.getByTestId('dt_contract-type-info')).toBeInTheDocument();
    });
});
