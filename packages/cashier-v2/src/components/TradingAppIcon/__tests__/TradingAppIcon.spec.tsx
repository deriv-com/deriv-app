import React from 'react';
import { render, screen } from '@testing-library/react';
import TradingAppIcon from '../TradingAppIcon';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    AccountsDerivXIcon: jest.fn(({ iconSize }) => <div>AccountsDerivXIcon-{iconSize}</div>),
}));

describe('<TradingAppIcon />', () => {
    it('should render the correct trading app icon', () => {
        render(<TradingAppIcon name='DERIVX' size='sm' />);

        expect(screen.getByText('AccountsDerivXIcon-sm')).toBeInTheDocument();
    });
});
