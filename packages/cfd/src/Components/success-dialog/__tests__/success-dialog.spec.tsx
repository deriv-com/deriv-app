import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessDialog from '../success-dialog';

describe('<SuccessDialog />', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render SuccessDialog when is_open is true', () => {
        render(<SuccessDialog is_open={true} />);
        expect(
            screen.getByRole('heading', {
                name: /success!/i,
            })
        ).toBeInTheDocument();
    });
});
