import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletResetBalance from '../WalletResetBalance';

jest.mock('../../../modules', () => ({
    ResetBalanceModule: jest.fn(() => <div>MockedResetBalanceModule</div>),
}));

describe('WalletResetBalance', () => {
    it('should render ResetBalanceModule', () => {
        render(<WalletResetBalance />);

        expect(screen.getByText(/MockedResetBalanceModule/)).toBeInTheDocument();
    });
});
