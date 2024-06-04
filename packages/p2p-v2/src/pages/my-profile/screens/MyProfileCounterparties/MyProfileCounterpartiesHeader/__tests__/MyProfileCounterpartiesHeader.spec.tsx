import React from 'react';
import MyProfileCounterpartiesHeader from '../MyProfileCounterpartiesHeader';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockProps = {
    dropdownValue: 'all',
    onClickFilter: jest.fn(),
    setDropdownValue: jest.fn(),
    setSearchValue: jest.fn(),
};

describe('MyProfileCounterpartiesHeader', () => {
    it('should render the component as expected', () => {
        render(<MyProfileCounterpartiesHeader {...mockProps} />);
        expect(
            screen.getByText(
                'When you block someone, you won’t see their ads, and they can’t see yours. Your ads will be hidden from their search results, too.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Filter by')).toBeInTheDocument();
        const dropdownField = screen.getByRole('combobox');
        expect(dropdownField).toHaveValue('All');
    });
    it('should handle onclick of dropdown', () => {
        render(<MyProfileCounterpartiesHeader {...mockProps} />);
        const dropdownField = screen.getByRole('combobox');
        userEvent.click(dropdownField);
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Blocked')).toBeInTheDocument();
    });
});
