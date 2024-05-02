import React from 'react';
import { render, screen } from '@testing-library/react';
import AdRateError from '../AdRateError';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: () => ({
        data: {
            local_currencies: ['USD'],
        },
    }),
}));

const mockFloatingRateHook = {
    fixedRateAdvertsEndDate: '2024/12/31',
    rateType: 'float',
    reachedTargetDate: false,
};

jest.mock('@/hooks', () => ({
    useFloatingRate: () => mockFloatingRateHook,
}));

describe('AdRateError', () => {
    it('should render the component as expected', () => {
        render(<AdRateError />);
        expect(
            screen.getByText(
                'Floating rates are enabled for USD. Ads with fixed rates will be deactivated. Switch to floating rates by 2024/12/31.'
            )
        );
    });
    it('should render the corresponding message when rateType is fixed', () => {
        mockFloatingRateHook.rateType = 'fixed';
        render(<AdRateError />);
        expect(
            screen.getByText('Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.')
        );
    });
    it('should render the corresponding message when reachedTargetDate is true', () => {
        mockFloatingRateHook.reachedTargetDate = true;
        render(<AdRateError />);
        expect(
            screen.getByText('Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.')
        );
    });
});
