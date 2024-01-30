import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import { ModalProvider } from '../../ModalProvider';
import AccountsList from '../AccountsList';

jest.mock('../../../hooks/useDevice');
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <ModalProvider>{children}</ModalProvider>
    </APIProvider>
);

describe('AccountsList', () => {
    it('should render account list in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList isWalletSettled={true} />, { wrapper });
        expect(screen.getByTestId('dt_tabs')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tab_list')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tab_panels')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Options & multipliers')).toBeInTheDocument();
    });

    it('should render account list in desktop view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<AccountsList isWalletSettled={true} />, { wrapper });

        expect(screen.getByTestId('dt_desktop_accounts_list')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Options & Multipliers')).toBeInTheDocument();
    });
});
