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
    is_vanilla: false,
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
    IconTradeTypes: jest.fn(props => <div data-testid={props.type}>TradeIcon</div>),
    Money: jest.fn(() => <div>MoneyComponent</div>),
}));
jest.mock('Modules/Trading/Components/Form/Purchase/contract-info', () => jest.fn(() => <div>ContractInfo</div>));

describe('<PurchaseButton />', () => {
    it('should render a button with specific text for contract type and icon', () => {
        render(<PurchaseButton {...default_mocked_props} is_vanilla />);

        expect(screen.getByText(/TradeIcon/i)).toBeInTheDocument();
        expect(screen.getByText(/Call/i)).toBeInTheDocument();
    });

    it('should apply a specific classNames if is_loading === true', () => {
        render(<PurchaseButton {...default_mocked_props} is_vanilla is_loading index={0} />);

        const purchase_button = screen.getByRole('button');

        expect(purchase_button).toHaveClass('btn-purchase--animated--slide');
        expect(purchase_button).toHaveClass('btn-purchase--1__vanilla-opts');
    });

    it('should call function setPurchaseState and onClickPurchase if purchase button was clicked', () => {
        render(<PurchaseButton {...default_mocked_props} is_vanilla />);

        const purchase_button = screen.getByRole('button');
        userEvent.click(purchase_button);

        expect(default_mocked_props.setPurchaseState).toBeCalled();
        expect(default_mocked_props.onClickPurchase).toBeCalled();
    });

    it('should render the button with <Money /> component inside for multipliers contract', () => {
        render(<PurchaseButton {...default_mocked_props} is_multiplier type='MULTUP' />);

        expect(screen.getByText(/UP/i)).toBeInTheDocument();
        expect(screen.getByText(/MoneyComponent/i)).toBeInTheDocument();
    });

    it('should render the button with growth rate info inside for accumulators', () => {
        render(<PurchaseButton {...default_mocked_props} is_accumulator type='ACCU' />);

        expect(screen.getByText(/Buy/i)).toBeInTheDocument();
        expect(screen.getByText(/3%/i)).toBeInTheDocument();
    });

    it('should render icon with specific type if is_high_low === true', () => {
        render(<PurchaseButton {...default_mocked_props} is_disabled is_loading is_high_low should_fade type='CALL' />);

        expect(screen.getByText(/Higher/i)).toBeInTheDocument();
        expect(screen.getByTestId(/call_barrier/i)).toBeInTheDocument();
    });

    it('should render ContractInfo for mobile if contract type is not turbos or vanillas', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isDesktop as jest.Mock).mockReturnValueOnce(false);
        render(<PurchaseButton {...default_mocked_props} is_accumulator type='ACCU' />);

        expect(screen.getByText(/ContractInfo/i)).toBeInTheDocument();
    });
});
