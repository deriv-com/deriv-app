import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BinaryLink } from '../index';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';

type TMockBinaryLink = {
    to?: string;
};

const MockBinaryLink = ({ to }: TMockBinaryLink) => (
    <BrowserRouter>
        <BinaryLink active_class='active_class' to={to}>
            <div data-testid='dt_child' />
        </BinaryLink>
    </BrowserRouter>
);

describe('BinaryLink component', () => {
    it('should render "children" when passed in', () => {
        render(<MockBinaryLink to={routes.trade} />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should have "active_class" when passed in', () => {
        render(<MockBinaryLink to={routes.trade} />);
        userEvent.click(screen.getByTestId('dt_binary_link'));
        const link = screen.getByTestId('dt_binary_link');
        expect(link).toHaveClass('active_class');
    });

    it('should render "NavLink" when valid "to" property is passed', () => {
        render(<MockBinaryLink to={routes.trade} />);
        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });

    it('throws an error for an invalid route', () => {
        const viewComponent = () => render(<MockBinaryLink to='/invalid' />);
        expect(viewComponent).toThrowError('Route not found: /invalid');
    });
});
