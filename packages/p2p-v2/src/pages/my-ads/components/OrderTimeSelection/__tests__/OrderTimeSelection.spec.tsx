import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTimeSelection from '../OrderTimeSelection';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockUseDevice = useDevice as jest.Mock;

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ control, defaultValue, name, render }) =>
        render({
            field: { onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useFormContext: () => ({
        control: 'mockedControl',
    }),
}));

describe('OrderTimeSelection', () => {
    it('should render the order time selection component', () => {
        render(<OrderTimeSelection />);
        expect(screen.getByText('Orders must be completed in')).toBeInTheDocument();
    });
    it('should handle the dropdown click', () => {
        render(<OrderTimeSelection />);
        userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('1 hour')).toBeInTheDocument();
    });
    it('should not do anything on clicking info icon in desktop view', () => {
        render(<OrderTimeSelection />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_order_info_icon'));
        expect(screen.queryByRole('button', { name: 'Ok' })).not.toBeInTheDocument();
    });
    it('should handle the modal open in mobile view', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<OrderTimeSelection />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_order_info_icon'));
        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(screen.queryByRole('button', { name: 'Ok' })).not.toBeInTheDocument();
    });
});
