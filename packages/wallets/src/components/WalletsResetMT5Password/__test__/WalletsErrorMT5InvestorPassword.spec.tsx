import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import WalletsErrorMT5InvestorPassword from '../WalletsErrorMT5InvestorPassword';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

const props = {
    errorMessage: 'Mocked Error Message',
    renderButton: jest.fn(),
    title: 'mocked',
};

describe('<WalletsErrorMT5InvestorPassword />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render WalletsErrorMT5InvestorPassword on Desktop', () => {
        render(<WalletsErrorMT5InvestorPassword {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
        expect(screen.getByText('Reset mocked password')).toBeInTheDocument();
        expect(screen.getByText('Mocked Error Message')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
    });

    it('should render WalletsErrorMT5InvestorPassword on Mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<WalletsErrorMT5InvestorPassword {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
        expect(screen.getByText('Reset mocked password')).toBeInTheDocument();
        expect(screen.getByText('Mocked Error Message')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
    });
});
