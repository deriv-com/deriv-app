import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasskeyModal from '../passkey-modal';

describe('PasskeyModal', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('renders the modal correctly and responds to user interaction', () => {
        const handleClick = jest.fn();
        render(
            <PasskeyModal
                is_modal_open={true}
                title={<span>Test Title</span>}
                description={<span>Test Description</span>}
                button_text={<span>Test Button</span>}
                onButtonClick={handleClick}
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Test Button')).toBeInTheDocument();

        userEvent.click(screen.getByText('Test Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
