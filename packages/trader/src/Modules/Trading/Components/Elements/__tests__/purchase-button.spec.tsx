import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile } from '@deriv/shared';
import PurchaseButton from '../purchase-button';

const default_mocked_props = {
    basis: '',
    buy_info: { error: '' },
    currency: '',
    growth_rate: 0.03,
    has_deal_cancellation: false,
    index: 1,
    info: {
        has_error: false,
        id: 'test_id',
        message: 'test_message',
        growth_rate: 0.03,
        stake: '10',
    },
    is_accumulator: false,
    is_disabled: false,
    is_high_low: false,
    is_loading: false,
    is_multiplier: false,
    is_proposal_empty: false,
    is_vanilla: true,
    is_turbos: false,
    onClickPurchase: jest.fn(),
    purchased_states_arr: [true, false],
    should_fade: false,
    setPurchaseState: jest.fn(),
    type: 'VANILLALONGCALL',
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    IconTradeTypes: jest.fn(props => <p data-type={props.type}>TradeIcon</p>),
    Money: jest.fn(() => <p>MoneyComponent</p>),
}));
jest.mock('Modules/Trading/Components/Form/Purchase/contract-info', () => jest.fn(() => <p>ContractInfo</p>));

describe('<PurchaseButton />', () => {
    it('should render a button with specific text and icon', () => {
        render(<PurchaseButton {...default_mocked_props} />);

        expect(screen.getByText(/TradeIcon/i)).toBeInTheDocument();
        expect(screen.getByText(/Call/i)).toBeInTheDocument();
    });

    it('should apply a specific classNames if is_loading === true', () => {
        const new_mocked_props = { ...default_mocked_props, is_loading: true, index: 0 };
        render(<PurchaseButton {...new_mocked_props} />);

        const purchase_button = screen.getByRole('button');

        expect(purchase_button).toHaveClass('btn-purchase--animated--slide');
        expect(purchase_button).toHaveClass('btn-purchase--1__vanilla-opts');
    });

    it('should call function setPurchaseState and onClickPurchase if purchase button was clicked', () => {
        render(<PurchaseButton {...default_mocked_props} />);

        const purchase_button = screen.getByRole('button');
        userEvent.click(purchase_button);

        expect(default_mocked_props.setPurchaseState).toBeCalled();
        expect(default_mocked_props.onClickPurchase).toBeCalled();
    });

    it('should the button with <Money /> component inside for multipliers', () => {
        const new_mocked_props = { ...default_mocked_props, is_multiplier: true, is_vanilla: false, type: 'MULTUP' };
        render(<PurchaseButton {...new_mocked_props} />);

        expect(screen.getByText(/UP/i)).toBeInTheDocument();
        expect(screen.getByText(/MoneyComponent/i)).toBeInTheDocument();
    });

    it('should the button with growth rate info inside for accumulators', () => {
        const new_mocked_props = { ...default_mocked_props, is_accumulator: true, is_vanilla: false, type: 'ACCU' };
        render(<PurchaseButton {...new_mocked_props} />);

        expect(screen.getByText(/Buy/i)).toBeInTheDocument();
        expect(screen.getByText(/3%/i)).toBeInTheDocument();
    });

    it('should render icon with specific type if is_high_low === true', () => {
        const new_mocked_props = {
            ...default_mocked_props,
            is_disabled: true,
            is_loading: true,
            is_high_low: true,
            is_vanilla: false,
            type: 'CALL',
            should_fade: true,
        };
        render(<PurchaseButton {...new_mocked_props} />);

        const icon = screen.getByText(/TradeIcon/i);

        expect(screen.getByText(/Higher/i)).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('data-type', 'call_barrier');
    });

    it('should render ContractInfo for mobile if contract type is not turbos or vanillas', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        const new_mocked_props = {
            ...default_mocked_props,
            is_accumulator: true,
            is_vanilla: false,
            type: 'ACCU',
        };
        render(<PurchaseButton {...new_mocked_props} />);

        expect(screen.getByText(/ContractInfo/i)).toBeInTheDocument();
    });
});
