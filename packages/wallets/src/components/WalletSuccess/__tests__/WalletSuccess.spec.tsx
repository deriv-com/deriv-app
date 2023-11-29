import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletSuccess from '../WalletSuccess';

describe('<WalletSuccess />', () => {
    it('should render with the info provided', () => {
        render(
            <WalletSuccess
                description='Your new wallet account created'
                renderIcon={() => <i data-testid='dt-success-icon'>Icon</i>}
                title='Account created'
            />
        );

        expect(screen.getByText('Your new wallet account created')).toBeInTheDocument();
        expect(screen.getByText('Account created')).toBeInTheDocument();
        expect(screen.getByTestId('dt-success-icon')).toBeInTheDocument();
    });

    it('should render with the buttons', () => {
        const mockRenderButtons = jest.fn(() => <button data-testid='dt-button'>Button</button>);

        render(
            <WalletSuccess
                description='Your new wallet account created'
                renderButtons={mockRenderButtons}
                renderIcon={() => <i data-testid='dt-success-icon'>Icon</i>}
                title='Account created'
            />
        );

        expect(mockRenderButtons).toHaveBeenCalled();
        expect(screen.getByTestId('dt-button')).toBeInTheDocument();
    });
});
