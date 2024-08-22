import React from 'react';
import { DerivLightDemoResetBalanceIcon, DerivLightDemoResetBalanceSuccessfulIcon } from '@deriv/quill-icons';
import { render, screen } from '@testing-library/react';
import { getResetBalanceContent } from '../ResetBalanceContent';

describe('getResetBalanceContent', () => {
    const mockLocalize = jest.fn(key => key);
    const mockResetBalance = jest.fn();
    const mockNavigateToTransfer = jest.fn();

    const content = getResetBalanceContent(mockLocalize, mockResetBalance, mockNavigateToTransfer);

    it('returns the correct content for resetAvailable', () => {
        const { actionButton, description, icon, title } = content.resetAvailable;

        expect(title).toBe('Reset balance');
        expect(description).toBe('Reset your virtual balance to 10,000.00 USD.');
        expect(icon).toEqual(<DerivLightDemoResetBalanceIcon height={128} />);

        render(<>{actionButton}</>);
        const button = screen.getByRole('button', { name: 'Reset balance' });
        expect(button).toBeInTheDocument();
        button.click();
        expect(mockResetBalance).toHaveBeenCalledTimes(1);
    });

    it('returns the correct content for resetUnavailable', () => {
        const { actionButton, description, icon, title } = content.resetUnavailable;

        expect(title).toBe('Reset balance unavailable');
        expect(description).toBe('You can reset your balance when it is below USD 10,000.00');
        expect(icon).toEqual(<DerivLightDemoResetBalanceIcon height={128} />);
        expect(actionButton).toBeUndefined();
    });

    it('returns the correct content for success', () => {
        const { actionButton, description, icon, title } = content.success;

        expect(title).toBe('Success');
        expect(description).toBe('Your balance has been reset to 10,000.00 USD.');
        expect(icon).toEqual(<DerivLightDemoResetBalanceSuccessfulIcon height={128} />);

        render(<>{actionButton}</>);
        const button = screen.getByRole('button', { name: 'Transfer funds' });
        expect(button).toBeInTheDocument();
        button.click();
        expect(mockNavigateToTransfer).toHaveBeenCalledTimes(1);
    });
});
