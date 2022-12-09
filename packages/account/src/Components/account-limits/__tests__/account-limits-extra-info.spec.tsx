import React from 'react';
import { screen, render } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import AccountLimitsExtraInfo from '../account-limits-extra-info';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

describe('<AccountLimitsExtraInfo/>', () => {
    it('should render AccountLimitsExtraInfo component', () => {
        render(<AccountLimitsExtraInfo message='Lorem ipsum' />);
        expect(screen.getByText(/lorem ipsum/i)).toBeInTheDocument();
    });

    it('should render PopoverComponent if isMobile is false', () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        render(<AccountLimitsExtraInfo message='Lorem ipsum' />);
        expect(screen.queryByTestId('dt_acc_limits_popover')).toHaveClass('da-account-limits__popover');
    });

    it('should pass props to PopoverComponent if isMobile is false', async () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        render(<AccountLimitsExtraInfo message='Lorem ipsum' className='test_class' />);
        const popover = await screen.findByTestId('dt_acc_limits_popover');
        expect(popover).toHaveClass('test_class');
    });
});
