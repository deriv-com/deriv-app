import React from 'react';
import { screen, render } from '@testing-library/react';
import { SampleCreditCardModal } from '../sample-credit-card-modal';

describe('SampleCreditCardModal', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render modal props', () => {
        const props: React.ComponentProps<typeof SampleCreditCardModal> = {
            is_open: true,
            onClose: jest.fn(),
        };
        render(<SampleCreditCardModal {...props} />);
        expect(screen.getByRole('heading')).toHaveTextContent('How to mask your card?');
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'creditcardsample');
    });

    it('should not render modal when is_open is false', () => {
        const props: React.ComponentProps<typeof SampleCreditCardModal> = {
            is_open: false,
            onClose: jest.fn(),
        };
        render(<SampleCreditCardModal {...props} />);
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});
