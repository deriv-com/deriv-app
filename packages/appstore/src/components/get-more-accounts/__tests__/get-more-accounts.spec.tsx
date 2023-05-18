import React from 'react';
import GetMoreAccounts from '../get-more-accounts';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('GetMoreAccounts', () => {
    const props = {
        description: 'description',
        icon: 'icon',
        title: 'title',
        onClick: jest.fn(),
    };
    it('should render the component', () => {
        const { container } = render(<GetMoreAccounts {...props} />);
        expect(container).toBeInTheDocument();
    });

    it('should call the onClick prop when clicked', () => {
        render(<GetMoreAccounts {...props} />);
        userEvent.click(screen.getByText('title'));
        expect(props.onClick).toHaveBeenCalled();
    });
});
