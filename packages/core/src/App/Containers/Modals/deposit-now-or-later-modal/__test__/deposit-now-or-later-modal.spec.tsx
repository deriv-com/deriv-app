import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import DepositNowOrLaterModal from '../deposit-now-or-later-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('<DepositNowOrLaterModal />', () => {
    let modal_root_el: HTMLDivElement;

    const setShouldShowDepositNowOrLaterModal = jest.fn();
    const setShouldShowOneTimeDepositModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            should_show_deposit_now_or_later_modal: true,
            setShouldShowDepositNowOrLaterModal,
            setShouldShowOneTimeDepositModal,
        },
    });

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        modal_root_el.setAttribute('data-testid', 'dt_test_modal');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render modal with correct title for desktop', () => {
        render(<DepositNowOrLaterModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText(/Add funds and start trading/)).toBeInTheDocument();
    });

    it('should render modal with correct title for mobile', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });

        render(<DepositNowOrLaterModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText(/Add funds and start trading/)).toBeInTheDocument();
    });

    it('should call setShouldShowDepositNowOrLaterModal with false when try to click confirm button', () => {
        render(<DepositNowOrLaterModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button', {
            name: /Deposit now/,
        });
        userEvent.click(close_button);

        expect(setShouldShowDepositNowOrLaterModal).toHaveBeenCalledWith(false);
    });

    it('should call setShouldShowDepositNowOrLaterModal and setShouldShowOneTimeDepositModal for ROW account when try to click cancel or close button', () => {
        render(<DepositNowOrLaterModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button', {
            name: /Deposit later/,
        });
        userEvent.click(close_button);

        expect(setShouldShowDepositNowOrLaterModal).toHaveBeenCalledWith(false);
        expect(setShouldShowOneTimeDepositModal).toHaveBeenCalledWith(false);
    });
});
