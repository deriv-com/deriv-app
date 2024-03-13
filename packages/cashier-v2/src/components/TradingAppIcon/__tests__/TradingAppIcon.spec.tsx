import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingAppIcon from '../TradingAppIcon';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    AccountsDerivXIcon: jest.fn(({ iconSize }) => <div>AccountsDerivXIcon-{iconSize}</div>),
    AccountsDmt5DerivedIcon: jest.fn(({ iconSize }) => <div>AccountsDmt5DerivedIcon-{iconSize}</div>),
    AccountsDmt5FinancialIcon: jest.fn(({ iconSize }) => <div>AccountsDmt5FinancialIcon-{iconSize}</div>),
    AccountsDmt5SwfIcon: jest.fn(({ iconSize }) => <div>AccountsDmt5SwfIcon-{iconSize}</div>),
}));

describe('<TradingAppIcon />', () => {
    it('should render the correct icon for Deriv X account', () => {
        render(<TradingAppIcon name='DERIVX' size='sm' />);

        expect(screen.getByText('AccountsDerivXIcon-sm')).toBeInTheDocument();
    });
    it('should render the correct icon for MT5 Derived account', () => {
        render(<TradingAppIcon name='DMT5_DERIVED' size='sm' />);

        expect(screen.getByText('AccountsDmt5DerivedIcon-sm')).toBeInTheDocument();
    });
    it('should render the correct icon for MT5 Financial account', () => {
        render(<TradingAppIcon name='DMT5_FINANCIAL' size='sm' />);

        expect(screen.getByText('AccountsDmt5FinancialIcon-sm')).toBeInTheDocument();
    });
    it('should render the correct icon for MT5 Synthetic account', () => {
        render(<TradingAppIcon name='DMT5_SYNTHETIC' size='sm' />);

        expect(screen.getByText('AccountsDmt5FinancialIcon-sm')).toBeInTheDocument();
    });
    it('should render the correct icon for MT5 Swap-Free account', () => {
        render(<TradingAppIcon name='DMT5_ALL' size='sm' />);

        expect(screen.getByText('AccountsDmt5SwfIcon-sm')).toBeInTheDocument();
    });
});
