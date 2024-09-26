import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import ErrorComponent from '../error-component';

const mockErrorData = {
    header: 'Error Occurred',
    message: 'An unexpected error has occurred.',
    redirect_label: 'Go to Home',
    should_show_refresh: true,
    redirectOnClick: jest.fn(),
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

describe('ErrorComponent', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    beforeEach(() => {
        jest.spyOn(global, 'location', 'get').mockReturnValue({
            ...window.location,
            reload: jest.fn(),
        });
    });
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should render as a dialog when `is_dialog` is true', () => {
        render(<ErrorComponent is_dialog={true} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render as a dialog when `is_dialog` is false', () => {
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
        expect(screen.getByText(/Please refresh this page to continue./i)).toBeInTheDocument();
        const linkEl = screen.getByRole('link', { name: mockErrorData.redirect_label });
        expect(linkEl).toBeInTheDocument();
        expect(linkEl).toHaveAttribute('href', routes.trade);
        fireEvent.click(linkEl);
        expect(mockErrorData.redirectOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render correctly with default data when only minimum props are provided', () => {
        const mockMinimumErrorData = {
            header: 'Error Occurred',
            message: 'An unexpected error has occurred.',
            should_show_refresh: false,
        };
        render(
            <MemoryRouter>
                <ErrorComponent {...mockMinimumErrorData} />
            </MemoryRouter>
        );
        expect(screen.queryByText(/Please refresh this page to continue./i)).not.toBeInTheDocument();
        const linkEl = screen.getByRole('link', { name: 'Refresh' });
        fireEvent.click(linkEl);
        expect(global.location.reload).toHaveBeenCalledTimes(1);
    });

    it('should render ErrorModal with only `message` prop', () => {
        render(
            <MemoryRouter>
                <ErrorComponent message='An unexpected error has occurred.' />
            </MemoryRouter>,
            { wrapper }
        );
        expect(screen.getByText(/An unexpected error has occurred./i)).toBeInTheDocument();
    });

    it('should render as a dialog with provided data', () => {
        render(<ErrorComponent is_dialog={true} {...mockErrorData} />);
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: mockErrorData.header,
            })
        ).toBeInTheDocument();
        expect(screen.getByText(mockErrorData.message)).toBeInTheDocument();
        const buttonEl = screen.getByRole('button', {
            name: mockErrorData.redirect_label,
        });
        expect(buttonEl).toBeInTheDocument();
        fireEvent.click(buttonEl);
        expect(mockErrorData.redirectOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render as a dialog with default data when only is_dialog is set to true', () => {
        render(<ErrorComponent is_dialog={true} />);
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /there was an error/i,
            })
        ).toBeInTheDocument();
        expect(screen.getByText(/Sorry, an error occured while processing your request./i)).toBeInTheDocument();
        const buttonEl = screen.getByRole('button', {
            name: /ok/i,
        });
        expect(buttonEl).toBeInTheDocument();
        fireEvent.click(buttonEl);
        expect(global.location.reload).toHaveBeenCalledTimes(1);
    });
});
