import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExampleLink from '../example-link';

describe('ExampleLink', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('renders ExampleLink component', () => {
        render(<ExampleLink />);
        expect(screen.getByText('See example')).toBeInTheDocument();
    });

    it('should render SampleCreditCardModal when clicked', () => {
        render(<ExampleLink />);

        userEvent.click(screen.getByText('See example'));
        expect(screen.getByText('How to mask your card?')).toBeInTheDocument();
    });
});
