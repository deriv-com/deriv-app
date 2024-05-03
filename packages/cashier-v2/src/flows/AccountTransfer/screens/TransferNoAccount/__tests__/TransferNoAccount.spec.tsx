import React from 'react';
import { render, screen } from '@testing-library/react';
import { THooks } from '../../../../../hooks/types';
import TransferNoAccount from '../TransferNoAccount';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    ActionScreen: jest.fn(({ actionButtons, description, icon, title }) => (
        <div>
            <div>{actionButtons}</div>
            <div>{description}</div>
            <div>{icon}</div>
            <div>{title}</div>
        </div>
    )),
    Button: jest.fn(({ children, size }) => (
        <button>
            {size}
            <div>{children}</div>
        </button>
    )),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightCashierNoBalanceIcon: jest.fn(({ height, width }) => (
        <div>
            DerivLightCashierNoBalanceIcon/height={height}/width={width}
        </div>
    )),
}));

const mockAccounts = ['account 1', 'account 2'] as THooks.TransferAccounts;

describe('<TransferNoAccount />', () => {
    it('should test if correct props are passed to the ActionScreen if client has less than 2 accounts', () => {
        render(
            <TransferNoAccount accounts={[mockAccounts[0]]}>
                <div>Fake-Children</div>
            </TransferNoAccount>
        );

        expect(screen.getByText('You need at least two accounts')).toBeInTheDocument();
        expect(screen.getByText('DerivLightCashierNoBalanceIcon/height=128/width=128')).toBeInTheDocument();
        expect(screen.getByText('Please create another Deriv, Deriv MT5, or Deriv X account.')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('should test if client has 2 or more accounts then children are rendered', () => {
        render(
            <TransferNoAccount accounts={mockAccounts}>
                <div>Fake-Children</div>
            </TransferNoAccount>
        );
        expect(screen.getByText('Fake-Children')).toBeInTheDocument();
    });
});
