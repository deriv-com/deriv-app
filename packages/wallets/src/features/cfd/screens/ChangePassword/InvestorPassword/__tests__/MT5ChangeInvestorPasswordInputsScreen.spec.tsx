import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import MT5ChangeInvestorPasswordInputsScreen from '../MT5ChangeInvestorPasswordInputsScreen';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Button: ({ children, textSize }: { children: React.ReactNode; textSize: string }) => (
        <button>
            <span className={`text__size--${textSize}`}>{children}</span>
        </button>
    ),
    Text: ({ children, size }: { children: React.ReactNode; size: string }) => (
        <span className={`text__size--${size}`}>{children}</span>
    ),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('MT5ChangeInvestorPasswordInputsScreen', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('renders the component correctly in desktop', () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);

        const buttonText = screen.getByText(/Use this password to grant viewing access to another user/);
        const descriptionText = screen.getByText('Create or reset investor password');
        expect(buttonText).toBeInTheDocument();
        expect(descriptionText).toBeInTheDocument();
        expect(buttonText).toHaveClass('text__size--sm');
        expect(descriptionText).toHaveClass('text__size--sm');
    });

    it('renders the component correctly in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<MT5ChangeInvestorPasswordInputsScreen />);

        const buttonText = screen.getByText(/Use this password to grant viewing access to another user/);
        const descriptionText = screen.getByText('Create or reset investor password');
        expect(buttonText).toBeInTheDocument();
        expect(descriptionText).toBeInTheDocument();
        expect(buttonText).toHaveClass('text__size--md');
        expect(descriptionText).toHaveClass('text__size--md');
    });
});
