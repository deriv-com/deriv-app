import React from 'react';
import { render } from '@testing-library/react';
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

    it('should render <ContractTypeMenu /> component when click on ', () => {
        const wrapper = render(<ContractTypeWidget list={list} value={item.value} />);
        const dt_contract_widget = wrapper.getByTestId('dt_contract_widget');

        expect(dt_contract_widget).toBeInTheDocument();
    });
});
