import React from 'react';
import { render, screen } from '@testing-library/react';
import AdErrorTooltipModal from '../AdErrorTooltipModal';

const mockProps = {
    accountCurrency: 'USD',
    advertType: 'buy',
    balanceAvailable: 100,
    dailyBuyLimit: '150',
    dailySellLimit: '230',
    isModalOpen: true,
    onRequestClose: jest.fn(),
    remainingAmount: 100,
    visibilityStatus: [],
};

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: () => ({
        data: {
            local_currencies: ['USD'],
        },
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/pages/my-ads/components', () => ({
    ...jest.requireActual('@/pages/my-ads/components'),
    AdRateError: () => <div>AdRateError</div>,
}));

describe('AdErrorTooltipModal', () => {
    it('should render the component as expected', () => {
        render(<AdErrorTooltipModal {...mockProps} />);
        expect(
            screen.getByText('Your ad isn’t listed on Buy/Sell due to the following reason(s):')
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advert_max_limit', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advert_max_limit'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than the maximum amount per order USD.'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advert_min_limit', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advert_min_limit'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advert_remaining', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advert_remaining'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount (100 USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advertiser_ads_paused', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advertiser_ads_paused'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText('This ad is not listed on Buy/Sell because you have paused all your ads.')
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advertiser_balance', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advertiser_balance'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance (100 USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advertiser_daily_limit', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advertiser_daily_limit'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit (150 USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advertiser_temp_ban', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advertiser_temp_ban'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                'You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.'
            )
        ).toBeInTheDocument();
    });
    it('should display the corresponding reason when visibilityStatus is advert_inactive', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advert_inactive'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(screen.getByText('AdRateError')).toBeInTheDocument();
    });
    it('should display the corresponding reasons when there are multiple reasons', () => {
        const newProps = {
            ...mockProps,
            visibilityStatus: ['advertiser_temp_ban', 'advertiser_daily_limit'],
        };
        render(<AdErrorTooltipModal {...newProps} />);
        expect(
            screen.getByText(
                '1. You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.'
            )
        ).toBeInTheDocument();
    });
});
