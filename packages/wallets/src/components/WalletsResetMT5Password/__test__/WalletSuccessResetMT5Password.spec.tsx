import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import useDevice from '../../../hooks/useDevice';
import { ModalProvider } from '../../ModalProvider';
import WalletSuccessResetMT5Password from '../WalletSuccessResetMT5Password';

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
    isInvestorPassword: false,
    onClick: jest.fn(),
    title: 'mocked',
};

describe('<WalletsErrorMT5InvestorPassword />', () => {
    it('should render WalletSuccessResetMT5Password', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
    });

    it('should render content if isInvestorPassword is true', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<WalletSuccessResetMT5Password {...props} isInvestorPassword />, { wrapper });
        expect(screen.getByText('Reset mocked password'));
        expect(screen.getByText('Password saved'));
        expect(screen.getByText('Your investor password has been changed.'));
        expect(screen.getByRole('button', { name: 'Ok' }));
    });

    it('should render content if isInvestorPassword is false', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByText('Manage mocked password'));
        expect(screen.getByText('Success'));
        expect(
            screen.getByText(
                'You have a new mocked password to log in to your mocked accounts on the web and mobile apps.'
            )
        );
        expect(screen.getByRole('button', { name: 'Done' }));
    });

    it('should execute function onClick when button is clicked', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: 'Done' }));
        userEvent.click(screen.getByRole('button', { name: 'Done' }));
        expect(props.onClick).toBeCalled();
    });

    it('should render WalletSuccessResetMT5Password on Mobile', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
    });
});
