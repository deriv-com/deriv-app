import React, { PropsWithChildren } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider, TModalContext, useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../MT5TradeModal';
import CTraderAddAccountSuccessModal from '../CTraderAddAccountSuccessModal';

const mockModalFn = jest.fn();
jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
        hide: mockModalFn,
        show: mockModalFn,
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

describe('CTraderAddAccountSuccessModal', () => {
    const mockUseModal = useModal as jest.MockedFunction<() => TModalContext>;
    const mockShowModal = jest.fn();
    const mockHideModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseModal.mockReturnValue({
            getModalState: jest.fn(),
            hide: mockHideModal,
            isOpen: false,
            setModalOptions: jest.fn(),
            setModalState: jest.fn(),
            show: mockShowModal,
        });
    });

    it('should render the components with success message and buttons', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(
            screen.getByText(/Congratulations, you have successfully created your real Deriv cTrader account/i)
        ).toBeInTheDocument();
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getByText('Transfer now')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_ctrader_success_icon')).toBeInTheDocument();
    });

    it('should hide modal when "Maybe Later" button is clicked', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });
        fireEvent.click(screen.getByText('Maybe later'));

        expect(mockHideModal).toHaveBeenCalled();
    });

    it('should show the MT5TradeModal when "Transfer now" button is clicked', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });
        fireEvent.click(screen.getByText('Transfer now'));

        expect(mockShowModal).toHaveBeenCalledWith(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />);
    });
});
