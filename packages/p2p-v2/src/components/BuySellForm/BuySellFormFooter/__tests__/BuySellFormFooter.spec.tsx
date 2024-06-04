import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import BuySellFormFooter from '../BuySellFormFooter';

const mockProps = {
    isDisabled: false,
    onClickCancel: jest.fn(),
};
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;
describe('BuySellFormFooter', () => {
    it('should render the footer as expected', () => {
        render(<BuySellFormFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
    it('should handle onclick for cancel button', () => {
        render(<BuySellFormFooter {...mockProps} />);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        cancelButton.click();
        expect(mockProps.onClickCancel).toHaveBeenCalled();
    });
    it('should handle onclick for confirm button', () => {
        const newProps = { mockProps, onSubmit: jest.fn() };
        render(<BuySellFormFooter {...newProps} />);
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        confirmButton.click();
        expect(newProps.onSubmit).toHaveBeenCalled();
    });
    it('should render as expected in responsive view as well', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<BuySellFormFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
});
