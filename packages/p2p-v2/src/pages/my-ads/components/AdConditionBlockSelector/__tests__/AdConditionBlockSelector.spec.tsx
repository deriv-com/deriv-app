import React from 'react';
import { render, screen } from '@testing-library/react';
import AdConditionBlockSelector from '../AdConditionBlockSelector';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/constants', () => ({
    ...jest.requireActual('@/constants'),
    AD_CONDITION_CONTENT: {
        type: {
            description: 'description',
            options: [
                {
                    label: 'label',
                    value: 1,
                },
            ],
            title: 'title',
        },
    },
}));
describe('AdConditionBlockSelector', () => {
    it('should render the component as expected', () => {
        render(<AdConditionBlockSelector onClick={jest.fn()} type='type' />);
        expect(screen.getByText('title')).toBeInTheDocument();
    });
    it('should handle the onClick for AdConditionBlockElement', () => {
        const mockOnClick = jest.fn();
        render(<AdConditionBlockSelector onClick={mockOnClick} type='type' />);
        screen.getByRole('button', { name: 'label' }).click();
        expect(mockOnClick).toHaveBeenCalledWith(1);
    });
});
