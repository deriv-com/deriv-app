import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFormattedAccountsLimits } from '../../../mocks/accountLimitsResponse.mock';
import { AccountLimitsTable } from '../AccountLimitsTable';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('AccountLimitsTable', () => {
    it('should render the table with correct data', () => {
        render(<AccountLimitsTable accountLimitValues={mockFormattedAccountsLimits} />);
        expect(screen.getByText('Trading limits')).toBeInTheDocument();
        expect(screen.getByText('*Maximum number of open positions')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('*Maximum account cash balance')).toBeInTheDocument();
    });

    it('should render the hintInfo with Popover icon in desktop', () => {
        render(<AccountLimitsTable accountLimitValues={mockFormattedAccountsLimits} />);
        expect(screen.getAllByTestId('dt_account_limits_table_info_icon')).toHaveLength(4);
    });

    it('should render the Popover message when icon is hovered in desktop', () => {
        render(<AccountLimitsTable accountLimitValues={mockFormattedAccountsLimits} />);
        const infoIcon = screen.queryAllByTestId('dt_account_limits_table_info_icon')[0];
        expect(infoIcon).toBeInTheDocument();
        userEvent.hover(infoIcon);
        expect(
            screen.getByText(
                'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
            )
        ).toBeInTheDocument();
    });

    it('should render the hintInfo as description in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<AccountLimitsTable accountLimitValues={mockFormattedAccountsLimits} />);
        expect(screen.queryByTestId('dt_account_limits_table_info_icon')).not.toBeInTheDocument();
        expect(
            screen.getByText(
                'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
            )
        ).toBeInTheDocument();
    });
});
