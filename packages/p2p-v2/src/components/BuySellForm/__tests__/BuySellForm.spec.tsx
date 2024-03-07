import React from 'react';
import Modal from 'react-modal';
import { floatingPointValidator } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellForm from '../BuySellForm';

const mockMutateFn = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    p2p: {
        order: {
            useCreate: jest.fn(() => ({
                mutate: mockMutateFn,
            })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;
const mockOnChange = jest.fn();
const mockHandleSubmit = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ control, defaultValue, name, render }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: mockOnChange, value: defaultValue },
            fieldState: { error: null },
        }),
    useForm: () => ({
        control: 'mockedControl',
        formState: { isValid: true },
        getValues: jest.fn(() => ({
            amount: 1,
        })),
        handleSubmit: mockHandleSubmit,
    }),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    floatingPointValidator: jest.fn(() => false),
}));
const mockFloatingPointValidator = floatingPointValidator as jest.Mock;

const mockAdvertValues = {
    account_currency: 'USD',
    advertiser_details: {
        name: 'name',
        rating_average: 5,
        rating_count: 5,
    },
    description: 'description',
    id: 'id',
    is_buy: true,
    local_currency: 'USD',
    max_order_amount_limit_display: '1000',
    min_order_amount_limit: 1,
    min_order_amount_limit_display: '1',
    order_expiry_period: 30,
    payment_method_names: ['alipay'],
    rate: 1,
    rate_type: 'fixed',
    type: 'sell',
};
const mockProps = {
    advert: mockAdvertValues,
    advertiserBuyLimit: 1000,
    advertiserPaymentMethods: [
        {
            display_name: 'alipay',
            id: '1',
        },
    ],
    advertiserSellLimit: 1000,
    balanceAvailable: 10,
    displayEffectiveRate: '1',
    effectiveRate: 1,
    isModalOpen: true,
    onRequestClose: jest.fn(),
    paymentMethods: [
        {
            display_name: 'alipay',
            type: 'online',
        },
    ],
};
let element: HTMLElement;
describe('BuySellForm', () => {
    beforeAll(() => {
        element = document.createElement('div');
        element.setAttribute('id', 'v2_modal_root');
        document.body.appendChild(element);
        Modal.setAppElement('#v2_modal_root');
    });
    afterAll(() => {
        document.body.removeChild(element);
    });
    it('should render the form as expected', () => {
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it('should render the inline message when rate type is float', () => {
        render(<BuySellForm {...mockProps} advert={{ ...mockAdvertValues, rate_type: 'float' }} />);
        expect(
            screen.getByText(
                'If the market rate changes from the rate shown here, we won’t be able to process your order.'
            )
        ).toBeInTheDocument();
    });
    it('should render the form as expected in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<BuySellForm {...mockProps} />);
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });
    it("should handle onsubmit when form is submitted and it's valid", () => {
        mockUseDevice.mockReturnValue({
            isMobile: false,
        });
        render(<BuySellForm {...mockProps} />);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        userEvent.click(confirmButton);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });
    it('should disable the input field when balance is 0', () => {
        render(<BuySellForm {...mockProps} balanceAvailable={0} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        expect(inputField).toBeDisabled();
    });
    it('should check if the floating point validator is called on changing value in input field', () => {
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        userEvent.type(inputField, '1');
        expect(mockFloatingPointValidator).toHaveBeenCalled();
    });
    it('should render the advertiserSellLimit as max limit if buy limit < max order amount limit', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, max_order_amount_limit_display: '10', type: 'buy' }}
                advertiserBuyLimit={5}
            />
        );
        expect(screen.getByText('Limit: 1-5.00USD')).toBeInTheDocument();
    });
    it('should return the advertiserBuyLimit as max limit if sell limit < max order amount limit and sell order', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, max_order_amount_limit_display: '10', type: 'sell' }}
                advertiserSellLimit={5}
            />
        );
        expect(screen.getByText('Limit: 1-5.00USD')).toBeInTheDocument();
    });
    it('should call onchange when input field value is changed', () => {
        mockFloatingPointValidator.mockReturnValue(true);
        render(<BuySellForm {...mockProps} />);
        const inputField = screen.getByPlaceholderText('Buy amount');
        userEvent.type(inputField, '1');
        expect(mockOnChange).toHaveBeenCalled();
    });
    it('should render the bank details text area when sell order and no payment methods are there', () => {
        render(<BuySellForm {...mockProps} advert={{ ...mockAdvertValues, payment_method_names: [], type: 'buy' }} />);
        expect(screen.getByText('Your bank details')).toBeInTheDocument();
    });
    it('should render the contact details text area when sell order and payment methods are there', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, payment_method_names: ['alipay'], type: 'buy' }}
            />
        );
        expect(screen.getByText('Your contact details')).toBeInTheDocument();
    });
    it('should send the payment_method_ids when payment methods are selected and sell order', () => {
        render(
            <BuySellForm
                {...mockProps}
                advert={{ ...mockAdvertValues, payment_method_names: ['alipay'], type: 'buy' }}
            />
        );
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        userEvent.click(confirmButton);
        expect(mockMutateFn).toHaveBeenCalledWith(expect.objectContaining({ payment_method_ids: [1] }));
    });
});
