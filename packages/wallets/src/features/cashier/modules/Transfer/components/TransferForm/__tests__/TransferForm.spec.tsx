import React from 'react';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../hooks/useDevice';
import { TransferProvider, useTransfer } from '../../../provider';
import TransferForm from '../TransferForm';

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    TransferProvider: jest.fn(({ children }) => <div>{children}</div>),
    useTransfer: jest.fn(),
}));

jest.mock('../../TransferFormAmountInput', () => ({
    ...jest.requireActual('../../TransferFormAmountInput'),
    TransferFormAmountInput: jest.fn(({ fieldName }) => <input placeholder={fieldName} type='input' />),
}));

jest.mock('../../TransferFormDropdown', () => ({
    ...jest.requireActual('../../TransferFormDropdown'),
    TransferFormDropdown: jest.fn(({ fieldName }) => <button>{fieldName}</button>),
}));

jest.mock('../../TransferMessages', () => ({
    ...jest.requireActual('../../TransferMessages'),
    TransferFormAmountTransferMessagesInput: jest.fn(() => <div>TransferMessages</div>),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <TransferProvider>{children}</TransferProvider>;

describe('<TransferForm />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: false,
        });
    });

    it('should test if the loader is shown until values are received from useTransfer hook', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            isLoading: true,
        });

        render(<TransferForm />, { wrapper });

        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should test that transfer button is disabled when fromAmount is 0');
    it('should test that transfer button is disabled when toAmount is 0');

    it('should test that transfer button is disabled when when there is an error in the input');

    it('should test if API is called with correct params when transfer button is clicked', () => {
        const dummyRequest = jest.fn();

        (useTransfer as jest.Mock).mockReturnValue({
            activeWallet: {
                loginid: 'CR1',
            },
            requestTransferBetweenAccounts: dummyRequest,
        });

        render(<TransferForm />, { wrapper });

        expect(dummyRequest).toBeCalledWith({
            fromAccount: {
                loginid: 'CR1',
            },
        });
    });
});
