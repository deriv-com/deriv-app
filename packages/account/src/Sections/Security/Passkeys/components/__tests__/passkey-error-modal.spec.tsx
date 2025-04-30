import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasskeyErrorModal } from '../passkey-error-modal';

describe('PasskeyErrorModal', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_error = {
        name: 'TestErrorName',
        message: 'TestErrorMessage',
    };

    const mockButtonClick = jest.fn();

    it('renders PasskeyErrorModal with common error', async () => {
        render(<PasskeyErrorModal error={mock_error} is_modal_open onButtonClick={mockButtonClick} />);

        expect(screen.getByText('Unable to process your request')).toBeInTheDocument();
        expect(screen.getByText("We're facing a temporary issue. Try again later.")).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /ok/i }));
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });

    it('renders PasskeyErrorModal with NotSupportedError', async () => {
        jest.clearAllMocks();
        mock_error.name = 'NotSupportedError';
        render(<PasskeyErrorModal error={mock_error} is_modal_open onButtonClick={mockButtonClick} />);

        expect(screen.getByText('Biometric setup failed')).toBeInTheDocument();
        expect(screen.getByText("This device doesn't support biometrics.")).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /ok/i }));
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });

    it('does not render PasskeyErrorModal content if modal is closed', () => {
        render(<PasskeyErrorModal error={mock_error} is_modal_open={false} onButtonClick={mockButtonClick} />);

        expect(screen.queryByText('Unable to process your request')).not.toBeInTheDocument();
        expect(screen.queryByText('Biometric setup failed')).not.toBeInTheDocument();
    });
});
