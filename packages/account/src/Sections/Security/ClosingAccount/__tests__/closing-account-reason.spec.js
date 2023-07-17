import React from 'react';
import { act, render, screen, waitFor, fireEvent, userEvent } from '@testing-library/react';
import ClosingAccountReason from '../closing-account-reason';
import { mockStore, StoreProvider } from '@deriv/stores';

describe('<ClosingAccountReason />', () => {
    let store = mockStore();
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        let modal_root_el = document.getElementById('modal_root');
        document.body.removeChild(modal_root_el);
    });

    test('Should render properly', async () => {
        render(
            <StoreProvider store={store}>
                <ClosingAccountReason />
            </StoreProvider>
        );
        await waitFor(() => {
            screen.getAllByText(/Please tell us why you’re leaving/i);
        });
    });

    test('Should be disabled when no reason has been selected', async () => {
        render(
            <StoreProvider store={store}>
                <ClosingAccountReason />
            </StoreProvider>
        );

        // clicking the checkbox twice to select and unselect
        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));
        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));

        // when no reason is selected it should show error and the button should be disabled
        await waitFor(() => {
            expect(screen.getByText(/Please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getAllByRole('button')[1];
            expect(continueButton).toHaveAttribute('disabled');
        });
    });

    test('should reduce remaining chars', async () => {
        render(
            <StoreProvider store={store}>
                <ClosingAccountReason />
            </StoreProvider>
        );

        expect(screen.getByText(/Remaining characters: 110/i)).toBeInTheDocument();

        act(() => {
            fireEvent.change(screen.getByLabelText(/I want to stop myself from trading/i), {
                target: { value: 'true' },
            });
        });

        expect(screen.getByText(/Remaining characters: 110/i)).toBeInTheDocument();

        act(() => {
            fireEvent.change(screen.getByPlaceholderText(/What could we do to improve/i), {
                target: { value: 'do_to_improve' },
            });
        });

        expect(screen.getByText(/Remaining characters: 97/i)).toBeInTheDocument();

        screen.debug();
    });
});
