import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { APIProvider, useRequest } from '@deriv/api';
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
    const other_financial_priorities_text = /i have other financial priorities/i;
    const other_reasons_text = /i’m closing my account for other reasons\./i;

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
            expect(screen.getByText(/please tell us why you’re leaving/i)).toBeInTheDocument();
        });
    });

    it('Should be disabled when no reason has been selected', async () => {
        renderComponent();
        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));
        fireEvent.click(screen.getByRole('checkbox', { name: other_financial_priorities_text }));

        await waitFor(() => {
            expect(screen.getByText(/please select at least one reason/i)).toBeInTheDocument();
            const continueButton = screen.getAllByRole('button')[1];
            expect(continueButton).toBeDisabled();
        });
    });

    it('should reduce remaining chars', async () => {
        renderComponent();
        expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/i want to stop myself from trading/i), {
            target: { value: 'true' },
        });

        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 110/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/what could we do to improve/i), {
            target: { value: 'do_to_improve' },
        });
        await waitFor(() => {
            expect(screen.getByText(/remaining characters: 97/i)).toBeInTheDocument();
        });
    });

    it('should call redirectToSteps when back button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: other_reasons_text,
        });
        fireEvent.click(el_checkbox);

        fireEvent.click(screen.getByRole('button', { name: /back/i }));

        await waitFor(() => {
            expect(mock_props.redirectToSteps).toHaveBeenCalledTimes(1);
        });
    });

    it('should call closeDerivAccount when continue button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: other_reasons_text,
        });
        fireEvent.click(el_checkbox);

        fireEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(mockUseRequest).toBeCalledWith('account_closure');
        });
    });
});
