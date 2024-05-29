import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreferredCountriesFooter from '../PreferredCountriesFooter';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    isDisabled: false,
    onClickApply: jest.fn(),
    onClickClear: jest.fn(),
};

describe('PreferredCountriesFooter', () => {
    it('should render the component as expected', () => {
        render(<PreferredCountriesFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });
    it('should handle the onClick event for Clear button', () => {
        render(<PreferredCountriesFooter {...mockProps} />);
        const clearButton = screen.getByRole('button', { name: 'Clear' });
        userEvent.click(clearButton);
        expect(mockProps.onClickClear).toHaveBeenCalledTimes(1);
    });
    it('should handle the onClick event for apply button ', () => {
        render(<PreferredCountriesFooter {...mockProps} />);
        const applyButton = screen.getByRole('button', { name: 'Apply' });
        userEvent.click(applyButton);
        expect(mockProps.onClickApply).toHaveBeenCalledTimes(1);
    });
});
