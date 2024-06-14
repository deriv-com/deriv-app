import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdRateSwitchModal from '../AdRateSwitchModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockProps = {
    isModalOpen: true,
    onClickSet: jest.fn(),
    onRequestClose: jest.fn(),
    rateType: 'float',
    reachedEndDate: false,
};

describe('AdRateSwitchModal', () => {
    it('should render the modal as expected', () => {
        render(<AdRateSwitchModal {...mockProps} />);
        expect(screen.getByText('Set a floating rate for your ad.')).toBeInTheDocument();
    });
    it('should handle the onClickSet', () => {
        render(<AdRateSwitchModal {...mockProps} />);
        const button = screen.getByRole('button', { name: /Set floating rate/i });
        userEvent.click(button);
        expect(mockProps.onClickSet).toBeCalledTimes(1);
    });
    it('should handle the onRequestClose', () => {
        render(<AdRateSwitchModal {...mockProps} />);
        const button = screen.getByRole('button', { name: /I'll do this later/i });
        userEvent.click(button);
        expect(mockProps.onRequestClose).toBeCalledTimes(1);
    });
    it('should render the corresponding text for fixed rate', () => {
        render(<AdRateSwitchModal {...mockProps} rateType='fixed' />);
        expect(screen.getByText('Set a fixed rate for your ad.')).toBeInTheDocument();
    });
    it('should render the cancel button if reachedEndDate is true', () => {
        render(<AdRateSwitchModal {...mockProps} reachedEndDate />);
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
});
