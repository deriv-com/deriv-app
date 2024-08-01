import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import ErrorComponent from '../error-component';

const mockErrorData = {
    header: 'Error Occurred',
    message: 'An unexpected error has occurred.',
    redirect_label: 'Go to Home',
    should_show_refresh: true,
    redirectOnClick: jest.fn(),
};

describe('ErrorComponent', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    it('should render as a dialog when is_dialog is true', () => {
        render(<ErrorComponent is_dialog={true} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render as a standard message when is_dialog is false', () => {
        render(<ErrorComponent is_dialog={false} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render correctly with provided mock data', () => {
        render(
            <MemoryRouter>
                <ErrorComponent {...mockErrorData} />
            </MemoryRouter>
        );
        expect(
            screen.getByRole('heading', {
                level: 3,
                name: mockErrorData.header,
            })
        ).toBeInTheDocument();
        expect(screen.getByText(mockErrorData.message)).toBeInTheDocument();
        expect(screen.getByText(/refresh/i)).toBeInTheDocument();
        const linkEl = screen.getByRole('link', { name: mockErrorData.redirect_label });
        expect(linkEl).toBeInTheDocument();
        expect(linkEl).toHaveAttribute('href', routes.trade);
        fireEvent.click(linkEl);
        expect(mockErrorData.redirectOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render as a dialog with provided data', () => {
        mockErrorData.header = '';
        mockErrorData.redirect_label = '';
        render(<ErrorComponent is_dialog={true} {...mockErrorData} />);
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /there was an error/i,
            })
        ).toBeInTheDocument();
        const buttonEl = screen.getByRole('button', {
            name: /ok/i,
        });
        expect(buttonEl).toBeInTheDocument();
        fireEvent.click(buttonEl);
        expect(mockErrorData.redirectOnClick).toHaveBeenCalledTimes(1);
    });
});
