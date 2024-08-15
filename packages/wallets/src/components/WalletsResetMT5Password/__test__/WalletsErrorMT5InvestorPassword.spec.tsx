import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import useDevice from '../../../hooks/useDevice';
import { ModalProvider } from '../../ModalProvider';
import WalletsErrorMT5InvestorPassword from '../WalletsErrorMT5InvestorPassword';

jest.mock('../../../hooks/useDevice');
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

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
    it('should render WalletsErrorMT5InvestorPassword on Desktop', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<WalletsErrorMT5InvestorPassword {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
        expect(screen.getByText('Reset mocked password')).toBeInTheDocument();
        expect(screen.getByText('Mocked Error Message')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
    });

    it('should render WalletsErrorMT5InvestorPassword on Mobile', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<WalletsErrorMT5InvestorPassword {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
        expect(screen.getByText('Reset mocked password')).toBeInTheDocument();
        expect(screen.getByText('Mocked Error Message')).toBeInTheDocument();
        expect(screen.getByTestId('dt_modal_step_wrapper_header_icon'));
    });
});
