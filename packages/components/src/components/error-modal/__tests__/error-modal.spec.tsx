import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorModal from '../error-modal';

describe('<ErrorModa />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const messages = [{ message: 'Sorry for the interruption' }];

    it('should render the error modal with modal content', () => {
        render(<ErrorModal messages={messages} />);
        expect(screen.getByText(/Sorry for the interruption/i)).toBeInTheDocument();
        const error_description = screen.getByText('[object Object]');
        expect(error_description).toBeInTheDocument();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should closes the error modal when the Refresh button is clicked', () => {
        render(<ErrorModal messages={messages} />);
        const refresh_button = screen.getByRole('button', { name: /Refresh/i });
        const reload_mock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reload_mock },
            writable: true,
        });
        refresh_button.click();
        expect(window.location.reload).toHaveBeenCalled();
    });
});
