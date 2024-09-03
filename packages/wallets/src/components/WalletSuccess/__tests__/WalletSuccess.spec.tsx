import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletSuccess from '../WalletSuccess';

describe('<WalletSuccess />', () => {
    it('should render with the info provided', () => {
        render(
            <WalletSuccess
                actionButtons={<button data-testid='dt-button'>Button</button>}
                description='Your new wallet account created'
                renderIcon={() => <i data-testid='dt-success-icon'>Icon</i>}
                title='Account created'
            />
        );

        expect(screen.getByText('Your new wallet account created')).toBeInTheDocument();
        expect(screen.getByText('Account created')).toBeInTheDocument();
        expect(screen.getByTestId('dt-success-icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt-button')).toBeInTheDocument();
    });
});
