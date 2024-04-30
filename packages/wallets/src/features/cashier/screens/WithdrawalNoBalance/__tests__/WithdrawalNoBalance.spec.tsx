import React from 'react';
import { render, screen, within } from '@testing-library/react';
import WithdrawalNoBalance from '../WithdrawalNoBalance';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightCashierNoBalanceIcon: jest.fn(({ height, width }) => (
        <span>
            DerivLightCashierNoBalanceIcon-{height}/{width}
        </span>
    )),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletsActionScreen: jest.fn(({ description, descriptionSize, icon, renderButtons, title, titleSize }) => (
        <div>
            <div>{icon}</div>
            WalletsActionScreen-{description}/{descriptionSize}/{title}/{titleSize}
            <div>{renderButtons()}</div>
        </div>
    )),
}));

const mockActiveWallet = {
    balance: 0,
    currency: 'USD',
};

describe('WithdrawalNoBalance', () => {
    it('should test whether WalletsActionScreen is rendered with correct props', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <WithdrawalNoBalance activeWallet={mockActiveWallet}>
                <div>Fake Children</div>
            </WithdrawalNoBalance>
        );

        expect(
            screen.getByText(
                'WalletsActionScreen-Please make a deposit to use this feature./md/You have no funds in your USD account/xl'
            )
        ).toBeInTheDocument();

        expect(screen.getByText('DerivLightCashierNoBalanceIcon-128px/128px')).toBeInTheDocument();
        expect(within(screen.getByRole('button')).getByText('Deposit now')).toBeInTheDocument();
    });

    it('should test whether children are render if wallet balance > 0', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <WithdrawalNoBalance activeWallet={{ ...mockActiveWallet, balance: 1 }}>
                <div>Fake Children</div>
            </WithdrawalNoBalance>
        );

        expect(screen.getByText('Fake Children')).toBeInTheDocument();
    });
});
