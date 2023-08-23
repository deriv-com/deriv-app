import React from 'react';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import ClosingAccountReason from '../closing-account-reason';

describe('<ClosingAccountReason />', () => {
    const mockRootStore: ReturnType<typeof mockStore> = mockStore({});
    const mock_props = {
        onBackClick: jest.fn(),
    };
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    jest.mock('../closing-account-reason-form', () => <div>ClosingAccountReasonForm </div>);

    it('Should render ClosingAccountReason component', async () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ClosingAccountReason {...mock_props} />
            </StoreProvider>
        );
        await waitFor(() => {
            expect(screen.getByText(/Please tell us why you’re leaving/i)).toBeInTheDocument();
        });
    });

    it('Should be disabled when no reason has been selected', async () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ClosingAccountReason {...mock_props} />
            </StoreProvider>
        );

        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));
        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));

        await waitFor(() => {
            expect(screen.getByText(/Please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getAllByRole('button')[1];
            expect(continueButton).toBeDisabled();
        });
    });

    it('should reduce remaining chars', () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ClosingAccountReason {...mock_props} />
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
    });

    it('should call onBackClick when back button is clicked', () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ClosingAccountReason {...mock_props} />
            </StoreProvider>
        );

        const el_checkbox = screen.getByRole('checkbox', {
            name: /i’m closing my account for other reasons\./i,
        });
        act(() => {
            fireEvent.click(el_checkbox);
        });

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: /Back/i }));
        });

        expect(mock_props.onBackClick).toHaveBeenCalledTimes(1);
    });
});
