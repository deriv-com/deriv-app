import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider, useMutation } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import ClosingAccountReason from '../closing-account-reason';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

jest.mock('../closing-account-warning-modal', () => ({
    __esModule: true,
    default: () => <div>ClosingAccountWarningModal </div>,
}));

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation<'account_closure'>>;

describe('<ClosingAccountReason />', () => {
    const mockRootStore = mockStore({});

    const mock_props: React.ComponentProps<typeof ClosingAccountReason> = {
        redirectToSteps: jest.fn(),
    };

    let modal_root_el: HTMLDivElement;

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
        mockUseMutation.mockReturnValue({ isLoading: false });
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

    it('should call redirectToSteps when back button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: other_reasons_text,
        });
        userEvent.click(el_checkbox);

        userEvent.click(screen.getByRole('button', { name: /back/i }));

        await waitFor(() => {
            expect(mock_props.redirectToSteps).toHaveBeenCalledTimes(1);
        });
    });

    it('should show warning modal when continue button is clicked', async () => {
        renderComponent();

        const el_checkbox = screen.getByRole('checkbox', {
            name: other_reasons_text,
        });
        userEvent.click(el_checkbox);

        userEvent.click(screen.getByRole('button', { name: /continue/i }));

        await waitFor(() => {
            expect(screen.getByText('ClosingAccountWarningModal')).toBeInTheDocument;
        });
    });
});
