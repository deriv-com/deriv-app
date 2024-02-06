import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletCashier from '../WalletCashier';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../components/', () => ({
    ...jest.requireActual('../components/'),
    WalletCashierContent: jest.fn(() => (
        <>
            <div style={{ height: '300px' }}>WalletCashierContent</div>
        </>
    )),
    WalletCashierHeader: jest.fn(({ hideWalletDetails }) => {
        return <>{!hideWalletDetails && <div>WalletCashierHeader</div>}</>;
    }),
}));

describe('<WalletCashier />', () => {
    it('should show the loader until the response from API has been received', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isFetchedAfterMount: false,
            isLoading: true,
        });

        render(<WalletCashier />);
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should show the loader if data is re-fetched after the component is mounted', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isFetchedAfterMount: false,
            isLoading: false,
        });

        render(<WalletCashier />);
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should render the WalletCashierContent', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isFetchedAfterMount: true,
            isLoading: false,
        });

        render(<WalletCashier />);
        expect(screen.getByText('WalletCashierContent')).toBeInTheDocument();
    });

    it('should hide the wallet header when content is scrolled', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        (useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>).mockReturnValue({
            isFetchedAfterMount: true,
            isLoading: false,
        });

        render(<WalletCashier />);

        const walletsCashierContent = screen.getByTestId('dt_wallets_cashier_content');
        fireEvent.scroll(walletsCashierContent, { target: { scrollTop: 300 } });

        await expect(screen.queryByText('WalletCashierHeader')).not.toBeInTheDocument();
    });
});
