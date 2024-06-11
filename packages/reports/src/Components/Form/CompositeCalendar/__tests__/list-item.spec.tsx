import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListItem from '../list-item';

const mockDefaultProps = {
    label: 'Mocked label',
    is_active: false,
    onClick: jest.fn(),
};

describe('ListItem', () => {
    it('should render component with default props', () => {
        render(<ListItem {...mockDefaultProps} />);

        expect(screen.getByText('Mocked label')).toBeInTheDocument();
    });

    it('should apply specific className if is_active === true', () => {
        render(<ListItem {...mockDefaultProps} is_active />);

        expect(screen.getByRole('listitem')).toHaveClass('composite-calendar__prepopulated-list--is-active');
    });

    it('should call function onClick from props if user clicks on the component', () => {
        render(<ListItem {...mockDefaultProps} />);

        expect(mockDefaultProps.onClick).not.toBeCalled();
        userEvent.click(screen.getByRole('listitem'));
        expect(mockDefaultProps.onClick).toBeCalled();
    });
});
