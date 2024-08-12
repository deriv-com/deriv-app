import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingDisabledByResidenceModal from '../trading-disabled-by-residence-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../trading-disabled-by-residence-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    TradingDisabledByResidenceModalContent: () => <div>Content</div>,
}));

describe('<TradingDisabledByResidenceModal />', () => {
    let modal_root_el: HTMLDivElement;

    const setIsTradingDisabledByResidenceModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            is_trading_disabled_by_residence_modal_visible: true,
            setIsTradingDisabledByResidenceModal,
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

    it('should render modal for desktop', () => {
        render(<TradingDisabledByResidenceModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render modal for responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });

        render(<TradingDisabledByResidenceModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should call setIsTradingDisabledByResidenceModal with false when try to close modal', () => {
        render(<TradingDisabledByResidenceModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button', {
            name: '',
        });
        userEvent.click(close_button);

        expect(setIsTradingDisabledByResidenceModal).toHaveBeenCalledWith(false);
    });
});
