import React from 'react';
import VerificationModal from '../verification-modal';
import { fireEvent, render, screen } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => (Component: React.ReactElement) => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
}));

jest.mock('../verification-modal-content', () => jest.fn(() => <div>VerificationModalContent</div>));

describe('<VerificationDocumentSubmited />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not render the VerificationModal component', async () => {
        const mock_props = {
            is_verification_modal_visible: false,
        };
        const title = 'Submit your proof of identity and address';
        render(<VerificationModal {...mock_props} />);
        expect(screen.queryByText(title)).not.toBeInTheDocument();
        expect(screen.queryByText('VerificationModalContent')).not.toBeInTheDocument();
    });

    it('should render the VerificationModal component', async () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        const mock_props = {
            is_verification_modal_visible: true,
        };
        const title = 'Submit your proof of identity and address';
        render(<VerificationModal {...mock_props} />);
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText('VerificationModalContent')).toBeInTheDocument();
    });

    it('should setIsVerificationModalVisible to false', async () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        const mock_props = {
            is_verification_modal_visible: true,
            setIsVerificationModalVisible: jest.fn(),
        };
        render(<VerificationModal {...mock_props} />);
        const close_button = screen.getByRole('button');
        expect(close_button).toBeInTheDocument();
        fireEvent.click(close_button);
        expect(mock_props.setIsVerificationModalVisible).toHaveBeenCalledWith(false);
    });

    it('should setIsVerificationModalVisible to be false in isMobile', async () => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'deriv_app');
        document.body.appendChild(modal_root_el);

        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        const mock_props = {
            is_verification_modal_visible: true,
            setIsVerificationModalVisible: jest.fn(),
        };
        render(<VerificationModal {...mock_props} />);
        const close_button = screen.getByTestId('dt-dc-mobile-dialog-close-btn');
        expect(close_button).toBeInTheDocument();
        fireEvent.click(close_button);
        expect(mock_props.setIsVerificationModalVisible).toHaveBeenCalledWith(false);
    });
});
