import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from '../list-item';
import userEvent from '@testing-library/user-event';

const mock_props = {
    label: 'All time',
    is_active: true,
    onClick: jest.fn(),
};

describe('ListItem', () => {
    it('should render the list item', () => {
        render(<ListItem {...mock_props} />);
        expect(screen.getByText('All time')).toBeInTheDocument();
    });
    it('should handle onclick for label', () => {
        render(<ListItem {...mock_props} />);
        userEvent.click(screen.getByText('All time'));
        expect(mock_props.onClick).toHaveBeenCalled();
    });
});
