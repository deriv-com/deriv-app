import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import ReadyToVerifyModal from './ready-to-verify-modal';
import { useHasMFAccountDeposited } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    useHasMFAccountDeposited: jest.fn(),
}));

describe('<ReadyToVerifyModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component with deposit success message if client deposited for the first time', () => {
        const mock = mockStore({
            ui: {
                should_show_account_success_modal: true,
            },
        });
        (useHasMFAccountDeposited as jest.Mock).mockReturnValue({ has_mf_account_deposited: true });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<ReadyToVerifyModal />, {
            wrapper,
        });

        expect(screen.getByRole('heading', { name: /Successfully deposited/ })).toBeInTheDocument();

        expect(
            screen.getByText(
                /your funds will be available for trading once the verification of your account is complete\./i
            )
        ).toBeInTheDocument();

        const maybe_later_button = screen.getByRole('button', { name: /maybe later/i });
        const verify_now_button = screen.getByRole('button', { name: /verify now/i });

        expect(maybe_later_button).toBeInTheDocument();
        expect(verify_now_button).toBeInTheDocument();

        userEvent.click(maybe_later_button);
        expect(mock.ui.setShouldTriggerTourGuide).toBeCalledTimes(1);
        expect(mock.ui.setShouldTriggerTourGuide).toHaveBeenCalledWith(true);
    });

    it('should render the component with account created messages if client skip first_time deposit', () => {
        const mock = mockStore({
            ui: {
                should_show_account_success_modal: true,
            },
        });
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: false });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<ReadyToVerifyModal />, {
            wrapper,
        });

        expect(screen.getByRole('heading', { name: /account added/i })).toBeInTheDocument();

        expect(
            screen.getByText(
                /Your account will be available for trading once the verification of your account is complete./i
            )
        ).toBeInTheDocument();

        const maybe_later_button = screen.getByRole('button', { name: /maybe later/i });
        const verify_now_button = screen.getByRole('button', { name: /verify now/i });

        expect(maybe_later_button).toBeInTheDocument();
        expect(verify_now_button).toBeInTheDocument();

        userEvent.click(maybe_later_button);
        expect(mock.ui.setShouldTriggerTourGuide).toBeCalledTimes(1);
        expect(mock.ui.setShouldTriggerTourGuide).toHaveBeenCalledWith(true);
    });
});
