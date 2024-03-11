import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModal from '../FilterModal';

const mockProps = {
    isModalOpen: true,
    isToggled: true,
    onRequestClose: jest.fn(),
    onToggle: jest.fn(),
    selectedPaymentMethods: [],
    setSelectedPaymentMethods: jest.fn(),
};

let mockData = [
    {
        display_name: 'Alipay',
        id: 'alipay',
    },
    {
        display_name: 'Bank Transfer',
        id: 'bank_transfer',
    },
];

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        paymentMethods: {
            useGet: jest.fn(() => ({
                data: mockData,
            })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('<FilterModal />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render the initial page of the FilterModal', () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const resetButton = screen.getByRole('button', { name: 'Reset' });
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Matching ads')).toBeInTheDocument();
        expect(screen.getByText('Ads that match your Deriv P2P balance and limit.')).toBeInTheDocument();
        expect(toggleSwitch).toBeInTheDocument();
        expect(toggleSwitch).toBeChecked();
        expect(resetButton).toBeInTheDocument();
        expect(applyButton).toBeInTheDocument();
        expect(applyButton).toBeDisabled();
    });

    it('should enable the apply button when user toggles the ToggleSwitch', () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        userEvent.click(toggleSwitch);

        expect(toggleSwitch).not.toBeChecked();
        expect(applyButton).toBeEnabled();
    });

    it('should call setSelectedPaymentMethods, onToggle, and onRequestClose when user clicks the Apply button', () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        userEvent.click(toggleSwitch);
        userEvent.click(applyButton);

        expect(mockProps.setSelectedPaymentMethods).toHaveBeenCalled();
        expect(mockProps.onToggle).toHaveBeenCalled();
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should call setPaymentMethods when user clicks on Reset button', () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const resetButton = screen.getByRole('button', { name: 'Reset' });

        userEvent.click(toggleSwitch);
        expect(toggleSwitch).not.toBeChecked();

        userEvent.click(resetButton);

        expect(mockProps.setSelectedPaymentMethods).toHaveBeenCalled();
        expect(toggleSwitch).toBeChecked();
    });

    it('should render the payment methods page of the FilterModal', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckbox = screen.getByRole('checkbox', { name: 'Bank Transfer' });

        expect(screen.queryByText('Filter')).not.toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Search payment method')).toBeInTheDocument();
        expect(alipayCheckbox).toBeInTheDocument();
        expect(alipayCheckbox).not.toBeChecked();
        expect(bankTransferCheckbox).toBeInTheDocument();
        expect(bankTransferCheckbox).not.toBeChecked();
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toBeDisabled();
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).toBeDisabled();
    });

    it('should show the search results when user types in the search input', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const searchInput = screen.getByRole('searchbox');

        act(() => {
            userEvent.type(searchInput, 'alipay');
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText('Alipay')).toBeInTheDocument();
        expect(screen.queryByText('Bank Transfer')).not.toBeInTheDocument();
    });

    it('should show No results for message if payment method is not in the list', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const searchInput = screen.getByRole('searchbox');

        act(() => {
            userEvent.type(searchInput, 'paypal');
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText(/No results for "paypal"./s)).toBeInTheDocument();
        expect(screen.getByText('Check your spelling or use a different term.')).toBeInTheDocument();

        act(() => {
            userEvent.clear(searchInput);
        });

        act(() => {
            jest.runAllTimers();
        });
    });

    it('should enable the clear and confirm buttons when user selects a payment method', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        const clearButton = screen.getByRole('button', { name: 'Clear' });

        userEvent.click(alipayCheckbox);

        expect(alipayCheckbox).toBeChecked();
        expect(confirmButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it('should clear the selected payment methods when user clicks on the clear button', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const clearButton = screen.getByRole('button', { name: 'Clear' });

        userEvent.click(alipayCheckbox);
        userEvent.click(clearButton);

        expect(alipayCheckbox).not.toBeChecked();
    });

    it('should go back to the initial page when user clicks on the back button', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const backButton = screen.getByTestId('dt_p2p_v2_page_return_btn');

        userEvent.click(backButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should call go back to the initial page and display the selected payment methods when user clicks on the confirm button', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckbox = screen.getByRole('checkbox', { name: 'Bank Transfer' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });

        userEvent.click(alipayCheckbox);
        userEvent.click(bankTransferCheckbox);
        userEvent.click(confirmButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Alipay, Bank Transfer')).toBeInTheDocument();
    });

    it('should call setSelectedPaymentMethods if a payment method is unselected', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });

        userEvent.click(alipayCheckbox);
        userEvent.click(alipayCheckbox);

        expect(mockProps.setSelectedPaymentMethods).toHaveBeenCalled();
    });

    it('should populate the payment methods list with the data from the API', () => {
        mockData = undefined;
        const { rerender } = render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const alipayCheckbox = screen.queryByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckbox = screen.queryByRole('checkbox', { name: 'Bank Transfer' });

        expect(alipayCheckbox).not.toBeInTheDocument();
        expect(bankTransferCheckbox).not.toBeInTheDocument();

        mockData = [
            {
                display_name: 'Alipay',
                id: 'alipay',
            },
            {
                display_name: 'Bank Transfer',
                id: 'bank_transfer',
            },
        ];

        rerender(<FilterModal {...mockProps} />);

        const alipayCheckboxRerendered = screen.getByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckboxRerendered = screen.getByRole('checkbox', { name: 'Bank Transfer' });

        expect(alipayCheckboxRerendered).toBeInTheDocument();
        expect(bankTransferCheckboxRerendered).toBeInTheDocument();
    });

    it('should call onRequestClose if backButton is pressed on initial page in mobile', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });

        render(<FilterModal {...mockProps} />);

        const backButton = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(backButton);

        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should go back to initial page if backButton is pressed in payment methods page in mobile', () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        userEvent.click(paymentMethodsText);

        const backButton = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(backButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
    });
});
