import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeWidget from '../contract-type-widget';

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

    const item = {
        text: 'Multipliers',
        value: 'multiplier',
    };

    it('should render <ContractTypeMenu /> component when click on ', () => {
        render(<ContractTypeWidget onChange={jest.fn()} list={list} value={item.value} />);
        expect(screen.getByTestId('dt_contract_widget')).toBeInTheDocument();
    });
});
