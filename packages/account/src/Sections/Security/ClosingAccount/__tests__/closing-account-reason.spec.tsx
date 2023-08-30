import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { APIProvider, useRequest } from '@deriv/api';
import { useCloseDerivAccount } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import ClosingAccountReason from '../closing-account-reason';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

// @ts-expect-error ignore this until find a way to make arguments as partial
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'account_closure'>>;

describe('<ClosingAccountReason />', () => {
    const mockRootStore: ReturnType<typeof mockStore> = mockStore({});

    const mock_props = {
        redirectToSteps: jest.fn(),
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

    const renderComponent = () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        render(
            <APIProvider>
                <StoreProvider store={mockRootStore}>
                    <ClosingAccountReason {...mock_props} />
                </StoreProvider>
            </APIProvider>
        );
    };

    it('Should render ClosingAccountReason component', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Please tell us why you’re leaving/i)).toBeInTheDocument();
        });
    });

    it('Should be disabled when no reason has been selected', async () => {
        renderComponent();
        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));
        fireEvent.click(screen.getByRole('checkbox', { name: /I have other financial priorities./i }));

        await waitFor(() => {
            expect(screen.getByText(/Please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getAllByRole('button')[1];
            expect(continueButton).toBeDisabled();
        });
    });

    it('should reduce remaining chars', async () => {
        renderComponent();
        expect(screen.getByText(/Remaining characters: 110/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/I want to stop myself from trading/i), {
            target: { value: 'true' },
        });

        await waitFor(() => {
            expect(screen.getByText(/Remaining characters: 110/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/What could we do to improve/i), {
            target: { value: 'do_to_improve' },
        });

        expect(screen.getByText(/Remaining characters: 97/i)).toBeInTheDocument();
    });

    it('should call redirectToSteps when back button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: /i’m closing my account for other reasons\./i,
        });
        fireEvent.click(el_checkbox);

        fireEvent.click(screen.getByRole('button', { name: /Back/i }));

        await waitFor(() => {
            expect(mock_props.redirectToSteps).toHaveBeenCalledTimes(1);
        });
    });

    it('should call closeDerivAccount when continue button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: /i’m closing my account for other reasons\./i,
        });
        fireEvent.click(el_checkbox);

        fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

        await waitFor(() => {
            expect(mockUseRequest).toBeCalledWith('account_closure');
        });
    });
});
