import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { PasskeysLearnMore } from '../passkeys-learn-more';

jest.mock('../tips-block', () => ({
    TipsBlock: jest.fn(() => <div>TipsBlock</div>),
}));
jest.mock('../description-container', () => ({
    DescriptionContainer: jest.fn(() => <div>DescriptionContainer</div>),
}));

describe('PasskeysLearnMore', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders the tips correctly', () => {
        render(
            <StoreProvider store={mock_store}>
                <PasskeysLearnMore
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText('Effortless login with passkeys')).toBeInTheDocument();
        expect(screen.getByText('DescriptionContainer')).toBeInTheDocument();
        expect(screen.getByText('TipsBlock')).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        userEvent.click(screen.getByTestId('dt_learn_more_back_button'));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
