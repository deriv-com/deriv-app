import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAccountLimits, useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';
import TransferModule from '../Transfer';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAccountLimits: jest.fn(),
    useActiveAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: <div>Loader</div>,
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferForm: jest.fn(() => <div>TransferForm</div>),
    TransferReceipt: jest.fn(() => <div>TransferReceipt</div>),
}));

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    TransferProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('<Transfer />', () => {
    it('should check if the loader is rendered until all the responses for APIs have been received', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({});
        (useActiveAccount as jest.Mock).mockReturnValue({});
        (useCurrencyConfig as jest.Mock).mockReturnValue({});
        render(<TransferModule />);

        expect(screen.getByText('Loader')).toBeInTheDocument();
    });
});
