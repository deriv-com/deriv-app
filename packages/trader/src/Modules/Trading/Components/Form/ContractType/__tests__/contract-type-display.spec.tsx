import React from 'react';
import { screen, render } from '@testing-library/react';
import { isMobile, isDesktop, TRADE_TYPES } from '@deriv/shared';
import Display from '../contract-type-display';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: () => <div>MockedIcon</div>,
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

jest.mock('Assets/Trading/Categories/icon-trade-categories', () => jest.fn(() => 'IconTradeCategories'));

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
        label: 'Highs & Lows',
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

const mocked_props = {
    onClick: jest.fn(),
    value: TRADE_TYPES.RISE_FALL,
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
        render(<Display name='contract-type-display' list={list} {...mocked_props} value={TRADE_TYPES.OVER_UNDER} />);
        expect(screen.getByText('Over/Under')).toBeInTheDocument();
    });
    it('should have contract-type-widget__display--clicked class when is_open is true', () => {
        render(<Display name='contract-type-display' list={list} {...mocked_props} is_open />);
        expect(screen.getByTestId('dt_contract_dropdown')).toHaveClass('contract-type-widget__display--clicked');
    });
    it('should render icon if it is mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<Display name='contract-type-display' list={list} {...mocked_props} is_open />);

        expect(screen.getByText(/mockedicon/i)).toBeInTheDocument();
    });
});
