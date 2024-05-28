import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from 'src/constants';
import { ExampleLink } from '../ExampleLink';

describe('ExampleLink', () => {
    let elModalRoot: HTMLElement;
    beforeAll(() => {
        elModalRoot = document.createElement('div');
        elModalRoot.setAttribute('id', ACCOUNT_MODAL_REF.replace('#', ''));
        document.body.appendChild(elModalRoot);
    });

    afterAll(() => {
        document.body.removeChild(elModalRoot);
    });

    const linkText = 'See example';

    it('should render component', () => {
        render(<ExampleLink />);

        expect(screen.getByText(linkText)).toBeVisible();
    });

    it('should open modal when clicked', () => {
        render(<ExampleLink />);

        userEvent.click(screen.getByText(linkText));

        expect(screen.getByRole('dialog')).toBeVisible();
    });

    it('should close modal when clicked', () => {
        render(<ExampleLink />);

        userEvent.click(screen.getByText(linkText));
        expect(screen.getByRole('dialog')).toBeVisible();

        userEvent.click(screen.getByTestId('dt-close-icon'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
