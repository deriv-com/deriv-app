import React from 'react';
import { useDevice, useQueryString } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodsEmpty from '../PaymentMethodsEmpty';

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: false,
        isMobile: false,
        isTablet: false,
    }),
    useQueryString: jest.fn().mockReturnValue({ setQueryString: jest.fn() }),
}));

const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockuseQueryString = useQueryString as jest.MockedFunction<typeof useQueryString>;

describe('PaymentMethodsEmpty', () => {
    it('should render the component correctly', () => {
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
    });
    it('should call onaddpaymentmethods when ismobile is false', () => {
        const mockOnAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={mockOnAddPaymentMethod} />);
        const button = screen.getByRole('button', { name: 'Add payment methods' });
        userEvent.click(button);
        expect(mockOnAddPaymentMethod).toHaveBeenCalled();
    });
    it('should call onaddpaymentmethods when ismobile is true', () => {
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        const button = screen.getByRole('button', { name: 'Add payment methods' });
        userEvent.click(button);
        expect(onAddPaymentMethod).toHaveBeenCalled();
    });
    it('should render the correct content when ismobile is false', () => {
        const mockOnAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={mockOnAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_p2p_v2_full_page_mobile_wrapper')).not.toBeInTheDocument();
    });
    it('should render the correct content when ismobile is true', () => {
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        expect(screen.getByText('You haven’t added any payment methods yet')).toBeInTheDocument();
        expect(screen.getByText('Hit the button below to add payment methods.')).toBeInTheDocument();
        expect(screen.getByText('Add payment methods')).toBeInTheDocument();
        expect(screen.getByTestId('dt_p2p_v2_full_page_mobile_wrapper')).toBeInTheDocument();
    });
    it('should call setQueryString when ismobile is true', () => {
        const { setQueryString: mockSetQueryString } = mockuseQueryString();
        mockUseDevice.mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        const onAddPaymentMethod = jest.fn();
        render(<PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />);
        const back = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(back);
        expect(mockSetQueryString).toHaveBeenCalledWith({ tab: 'default' });
    });
});
