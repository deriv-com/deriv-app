import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BinaryLink } from '../index';

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
        render(<MockBinaryLink />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should have "active_class" when passed in', () => {
        render(<MockBinaryLink to='/' />);
        expect(screen.getByTestId('dt_binary_link')).toHaveClass('active_class');
    });

    it('should render "NavLink" when "to" property is passed', () => {
        render(<MockBinaryLink to='/' />);
        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });

    it('should render "a" element whe property "to" is not passed', () => {
        render(<MockBinaryLink />);
        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });
});
