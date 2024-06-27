import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BinaryLink } from '../index';
import { findRouteByPath, normalizePath } from '../helpers';

jest.mock('../helpers', () => ({
    findRouteByPath: jest.fn(),
    normalizePath: jest.fn(),
}));

const MockBinaryLink = ({ to }: { to: string }) => (
    <BrowserRouter>
        <BinaryLink active_class='active_class' to={to}>
            <div data-testid='dt_child' />
        </BinaryLink>
    </BrowserRouter>
);

describe('<BinaryLink />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockRoute = {
        path: '/test-route',
        exact: true,
    };

    it('should render "children" when passed in', () => {
        (normalizePath as jest.Mock).mockReturnValue('/test-route');
        (findRouteByPath as jest.Mock).mockReturnValue(mockRoute);
        render(<MockBinaryLink to='/test-route' />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });
    it('should have "active_class" when passed in', () => {
        (findRouteByPath as jest.Mock).mockReturnValue(mockRoute);
        (normalizePath as jest.Mock).mockReturnValue('/test-route');

        render(<MockBinaryLink to='/test-route' />);
        userEvent.click(screen.getByTestId('dt_binary_link'));
        const link = screen.getByTestId('dt_binary_link');
        expect(link).toHaveClass('active_class');
    });
    it('should render "NavLink" when valid "to" property is passed', () => {
        (findRouteByPath as jest.Mock).mockReturnValue(mockRoute);
        (normalizePath as jest.Mock).mockReturnValue('/test-route');

        render(<MockBinaryLink to='/test-route' />);
        expect(screen.getByTestId('dt_binary_link')).toBeInTheDocument();
    });
    it('throws an error for an invalid route', () => {
        (findRouteByPath as jest.Mock).mockReturnValue(undefined);
        (normalizePath as jest.Mock).mockReturnValue('/invalid');

        const viewComponent = () => render(<MockBinaryLink to='/invalid' />);
        expect(viewComponent).toThrowError('Route not found: /invalid');
    });
});
