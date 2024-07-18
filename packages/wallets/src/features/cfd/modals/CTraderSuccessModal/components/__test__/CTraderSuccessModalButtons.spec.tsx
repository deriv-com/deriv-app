import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import CTraderSuccessModalButtons from '../CTraderSuccessModalButtons';

jest.mock('../../../../../../hooks/useDevice');
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockHide = jest.fn();
const mockUseHistory = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockUseHistory }),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

const props = {
    hide: mockHide,
    isDemo: false,
};

describe('<CTraderSuccessModalButtons />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render on Desktop', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
    });

    it('should render onClick for Maybe later on Desktop', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Maybe later/i }));
        await waitFor(() => expect(mockHide).toHaveBeenCalledTimes(1));
    });

    it('should render onClick for Transfer funds on Desktop', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Transfer funds/i }));
        await waitFor(() => {
            expect(mockHide).toHaveBeenCalledTimes(1);
            expect(mockUseHistory).toHaveBeenCalledTimes(1);
        });
    });

    it('should render on Desktop for Demo accounts', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} isDemo />, { wrapper });
        expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /OK/i }));
        await waitFor(() => expect(mockHide).toHaveBeenCalledTimes(1));
    });

    it('should render on Mobile', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
    });

    it('should render onClick for Maybe later on Mobile', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Maybe later/i }));
        await waitFor(() => expect(mockHide).toHaveBeenCalledTimes(1));
    });

    it('should render onClick for Transfer funds on Mobile', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: /Maybe later/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /Transfer funds/i }));
        await waitFor(() => {
            expect(mockHide).toHaveBeenCalledTimes(1);
            expect(mockUseHistory).toHaveBeenCalledTimes(1);
        });
    });

    it('should render on Mobile for Demo accounts', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<CTraderSuccessModalButtons {...props} isDemo />, { wrapper });
        expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: /OK/i }));
        await waitFor(() => expect(mockHide).toHaveBeenCalledTimes(1));
    });
});
