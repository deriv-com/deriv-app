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
        render(<AccountLimitsExtraInfo message='Lorem Epsom' />);
        expect(screen.getByText(/lorem epsom/i)).toBeInTheDocument();
    });

    it('should render PopoverComponent if isMobile is false', () => {
        isMobile.mockReturnValue(false);
        const { container } = render(<AccountLimitsExtraInfo message='Lorem Epsom' />);
        expect(container.getElementsByClassName('da-account-limits__popover').length).toBe(1);
    });

    it('should pass props to PopoverComponent if isMobile is false', () => {
        isMobile.mockReturnValue(false);
        const { container } = render(<AccountLimitsExtraInfo message='Lorem Epsom' className='test_class' />);
        expect(container.getElementsByClassName('test_class').length).toBe(1);
    });
});
