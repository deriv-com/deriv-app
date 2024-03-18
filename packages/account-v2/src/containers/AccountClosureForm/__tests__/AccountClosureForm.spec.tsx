import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../constants';
import { AccountClosureForm } from '../AccountClosureForm';

describe('AccountClosureForm', () => {
    let elModalRoot: HTMLElement;
    beforeAll(() => {
        elModalRoot = document.createElement('div');
        elModalRoot.setAttribute('id', ACCOUNT_MODAL_REF.replace('#', ''));
        document.body.appendChild(elModalRoot);
    });

    afterAll(() => {
        document.body.removeChild(elModalRoot);
    });

    it('should render form', () => {
        render(<AccountClosureForm handleOnBack={jest.fn()} />);

        expect(screen.getAllByRole('checkbox')).toHaveLength(9);
        expect(screen.getAllByRole('textarea')).toHaveLength(2);
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    });

    it('should render remaining characters on user input', () => {
        render(<AccountClosureForm handleOnBack={jest.fn()} />);

        const otherTradingPlatforms = screen.getByRole('textarea', {
            name: /If you don't mind sharing, which other trading platforms do you use/i,
        });
        const doToImprove = screen.getByRole('textarea', { name: /What could we do to improve/i });
        expect(screen.getByText(/Remaining characters: 110/i)).toBeInTheDocument();

        userEvent.type(otherTradingPlatforms, 'Test');
        expect(screen.getByText(/Remaining characters: 106/i)).toBeInTheDocument();

        userEvent.type(doToImprove, 'Test');
        expect(screen.getByText(/Remaining characters: 102/i)).toBeInTheDocument();
    });

    it('should render error message when no reason is selected but user tries to type in text area', () => {
        render(<AccountClosureForm handleOnBack={jest.fn()} />);

        expect(screen.queryByText(/Please select at least one reason/i)).not.toBeInTheDocument();

        const otherTradingPlatforms = screen.getByRole('textarea', {
            name: /If you don't mind sharing, which other trading platforms do you use/i,
        });

        userEvent.type(otherTradingPlatforms, 'Test');

        expect(screen.getByText(/Please select at least one reason/i)).toBeInTheDocument();
    });
});
