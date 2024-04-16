import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { BinaryLink } from '../index';
import userEvent from '@testing-library/user-event';

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
    beforeEach(() => cleanup());
    it('should render "children" when passed in', () => {
        render(<MockBinaryLink to='/dtrader' />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should have "active_class" when passed in', () => {
        render(<MockBinaryLink to='/dtrader' />);
        userEvent.click(screen.getByTestId('dt_binary_link'));
        const link = screen.getByTestId('dt_binary_link');
        expect(link).toHaveClass('active_class');
    });

    it('should render "NavLink" when valid "to" property is passed', () => {
        render(<MockBinaryLink to='/dtrader' />);
        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });

    it('throws an error for an invalid route', () => {
        const viewComponent = () => render(<MockBinaryLink to='/invalid' />);
        expect(viewComponent).toThrowError('Route not found: /invalid');
    });
});
