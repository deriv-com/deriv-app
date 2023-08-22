import React from 'react';
import { screen, render } from '@testing-library/react';
import Display from '../contract-type-display';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: () => <div>MockedIcon</div>,
}));

jest.mock('Assets/Trading/Categories/icon-trade-categories', () => jest.fn(() => 'IconTradeCategories'));

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

const mocked_props = {
    onClick: jest.fn(),
    value: 'rise_fall',
    is_open: false,
};

describe('<Display />', () => {
    it('should render contract type display container ', () => {
        render(<Display name='contract-type-display' list={list} {...mocked_props} />);
        const contract_type_display_container = screen.getByTestId('dt_contract_dropdown');
        expect(contract_type_display_container).toBeInTheDocument();
        expect(contract_type_display_container).toHaveClass('contract-type-widget__display');
    });
    it('should render IconTradeCategories, a Mocked Icon, and contract_type that matches text of mocked input value', () => {
        render(<Display name='contract-type-display' list={list} {...mocked_props} />);
        expect(screen.getByText(/icontradecategories/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedicon/i)).toBeInTheDocument();
        expect(screen.getByText('Rise/Fall')).toBeInTheDocument();
    });
    it('should render contract_type that matches text of mocked input value', () => {
        mocked_props.value = 'over_under';
        render(<Display name='contract-type-display' list={list} {...mocked_props} />);
        expect(screen.getByText('Over/Under')).toBeInTheDocument();
    });
    it('should have contract-type-widget__display--clicked class when is_open is true', () => {
        mocked_props.is_open = true;
        render(<Display name='contract-type-display' list={list} {...mocked_props} />);
        expect(screen.getByTestId('dt_contract_dropdown')).toHaveClass('contract-type-widget__display--clicked');
    });
});
