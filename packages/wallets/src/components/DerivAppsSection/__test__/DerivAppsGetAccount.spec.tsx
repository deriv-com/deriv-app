import React, { PropsWithChildren } from 'react';
import {
    APIProvider,
    useActiveLinkedToTradingAccount,
    useCreateNewRealAccount,
    useInvalidateQuery,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import { DerivAppsGetAccount } from '../DerivAppsGetAccount';

const mockShow = jest.fn();
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(() => ({ isLoading: false })),
    useActiveWalletAccount: jest.fn(() => ({
        data: { currency_config: { display_code: 'USD' }, is_virtual: false, loginid: 'CRW1' },
    })),
    useCreateNewRealAccount: jest.fn(() => ({ isLoading: false })),
    useInvalidateQuery: jest.fn(),
}));
jest.mock('../../../hooks/useSyncLocalStorageClientAccounts', () =>
    jest.fn(() => ({ addTradingAccountToLocalStorage: jest.fn(() => Promise.resolve({})) }))
);
jest.mock('../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: {
            CRW1: {
                balance: 100,
                currency: 'USD',
            },
        },
        isLoading: false,
    }))
);
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));
jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({ show: mockShow })),
}));

const mockUseCreateNewRealAccount = useCreateNewRealAccount as jest.MockedFunction<typeof useCreateNewRealAccount>;
const mockUseActiveLinkedToTradingAccount = useActiveLinkedToTradingAccount as jest.MockedFunction<
    typeof useActiveLinkedToTradingAccount
>;
const mockUseInvalidateQuery = useInvalidateQuery as jest.MockedFunction<typeof useInvalidateQuery>;

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('DerivAppsGetAccount', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders the component', () => {
        render(<DerivAppsGetAccount />, { wrapper });
        expect(screen.getByText('Get')).toBeInTheDocument();
    });
    it('calls createTradingAccount function when the Get button is clicked', async () => {
        const mockMutateAsync = jest.fn(() => Promise.resolve({ new_account_real: 'new_account_real' }));
        const mockInvalidate = jest.fn();
        (mockUseCreateNewRealAccount as jest.Mock).mockReturnValue({ isLoading: false, mutateAsync: mockMutateAsync });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({ isLoading: false });
        mockUseInvalidateQuery.mockReturnValue(mockInvalidate);
        render(<DerivAppsGetAccount />, { wrapper });
        const button = screen.getByText('Get');
        userEvent.click(button);
        await waitFor(() => expect(mockMutateAsync).toBeCalled());
        await waitFor(() => expect(mockInvalidate).toBeCalledWith('account_list'));
    });
});
