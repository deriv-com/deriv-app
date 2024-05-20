import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { PasskeysStatusLayout } from '../passkeys-status-layout';

describe('PasskeysStatusLayout', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });

    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();
    const mock_description = 'Test description';
    const mock_title = 'Test title';
    const mock_primary_button_text = 'Test primary';
    const mock_secondary_button_text = 'Test secondary';

    it('renders PasskeysStatusLayout component correctly', () => {
        render(
            <StoreProvider store={mock_store}>
                <PasskeysStatusLayout
                    title={<div>{mock_title}</div>}
                    description={<div>{mock_description}</div>}
                    primary_button_text={<div>{mock_primary_button_text}</div>}
                    secondary_button_text={<div>{mock_secondary_button_text}</div>}
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        expect(screen.getByText(mock_title)).toBeInTheDocument();
        expect(screen.getByText(mock_description)).toBeInTheDocument();
        expect(screen.getByText(mock_description)).toBeInTheDocument();

        const primary_button = screen.getByRole('button', { name: mock_primary_button_text });
        expect(primary_button).toBeEnabled();

        userEvent.click(screen.getByRole('button', { name: mock_primary_button_text }));
        userEvent.click(screen.getByRole('button', { name: mock_secondary_button_text }));

        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });

    it('renders PasskeysStatusLayout and disable button if there is no connection', () => {
        mock_store.common.network_status.class = 'offline';

        render(
            <StoreProvider store={mock_store}>
                <PasskeysStatusLayout
                    title={<div>{mock_title}</div>}
                    description={<div>{mock_description}</div>}
                    primary_button_text={<div>{mock_primary_button_text}</div>}
                    secondary_button_text={<div>{mock_secondary_button_text}</div>}
                    onPrimaryButtonClick={mockOnPrimaryButtonClick}
                    onSecondaryButtonClick={mockOnSecondaryButtonClick}
                />
            </StoreProvider>
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveClass('dc-btn--secondary');
        expect(buttons[1]).toHaveClass('dc-btn--primary');
        expect(buttons[0]).toHaveTextContent(mock_secondary_button_text);
        expect(buttons[0]).toBeEnabled();
        expect(buttons[1]).toBeDisabled();
        const loader = screen.getByTestId('dt_initial_loader');
        expect(loader).toBeInTheDocument();
        expect(loader).toHaveClass('initial-loader--btn');
        expect(buttons[1].contains(loader)).toBeTruthy();
    });
});
