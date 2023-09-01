import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorModalContent from '../error-modal-content';

describe('<ErrorModalContent />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    const error_message = 'You have reached the rate limit of requests per second. Please try later.';
    it('should renders the error message', () => {
        render(<ErrorModalContent error_message={error_message} />);
        const error_description = screen.getByText(
            /You have reached the rate limit of requests per second. Please try later./i
        );
        expect(error_description).toBeInTheDocument();
    });

    it('renders the error message', () => {
        render(<ErrorModalContent error_message={error_message} />);
        const error_description = screen.getByText(
            /You have reached the rate limit of requests per second. Please try later./i
        );
        expect(error_description).toHaveClass('dc-text', 'da-icon-with-message__text__desc');
    });

    it('should renders the refresh button', () => {
        render(<ErrorModalContent error_message={error_message} />);
        const refresh_button = screen.getByText(/Refresh/i);
        expect(refresh_button).toBeInTheDocument();
    });

    it('should reload the page when the Refresh button is clicked', () => {
        render(<ErrorModalContent error_message={error_message} />);
        const refresh_button = screen.getByRole('button', { name: /Refresh/i });
        const reload_mock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reload_mock },
            writable: true,
        });
        refresh_button.click();
        expect(reload_mock).toHaveBeenCalled();
    });
});
