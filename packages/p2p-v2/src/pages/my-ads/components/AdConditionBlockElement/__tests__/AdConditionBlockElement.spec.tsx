import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import AdConditionBlockElement from '../AdConditionBlockElement';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockUseDevice = useDevice as jest.Mock;

const mockProps = {
    isSelected: true,
    label: 'title',
    onClick: jest.fn(),
    value: 1,
};

describe('AdConditionBlockElement', () => {
    it('should render the component as expected with given props', () => {
        render(<AdConditionBlockElement {...mockProps} />);
        expect(screen.getByText('title')).toBeInTheDocument();
    });
    it('should handle onClick for element', () => {
        render(<AdConditionBlockElement {...mockProps} />);
        const element = screen.getByText('title');
        element.click();
        expect(mockProps.onClick).toHaveBeenCalledWith(1);
    });
    it('should render the component as selected with text color white', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<AdConditionBlockElement {...mockProps} />);
        expect(screen.getByText('title')).toHaveClass('derivs-text__color--white');
    });
});
