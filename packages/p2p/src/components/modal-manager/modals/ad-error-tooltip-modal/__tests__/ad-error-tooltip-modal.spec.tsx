import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { P2PSettingsProvider, StoreProvider, mockStore } from '@deriv/stores';
import AdErrorTooltipModal from '../ad-error-tooltip-modal';

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>
            <P2PSettingsProvider>{children}</P2PSettingsProvider>
        </StoreProvider>
    </APIProvider>
);

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PSettings: jest.fn().mockReturnValue({
        p2p_settings: {
            maximum_order_amount: 100,
        },
    }),
}));

const mock_props = {
    visibility_status: [],
    account_currency: 'USD',
    remaining_amount: 100,
    advert_type: 'buy',
};

const el_modal = document.createElement('div');

describe('<AdErrorTooltipModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the component in default state', () => {
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText('Your ad isn’t listed on Buy/Sell due to the following reason(s):')
        ).toBeInTheDocument();
    });
    it('should display the error message for "advert_inactive"', () => {
        mock_props.visibility_status = ['advert_inactive'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText('Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.')
        ).toBeInTheDocument();
    });
    it('should display the error message for "advert_max_limit"', () => {
        mock_props.visibility_status = ['advert_max_limit'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText('This ad is not listed on Buy/Sell because its minimum order is higher than 100 USD.')
        ).toBeInTheDocument();
    });
    it('should display the error message for "advert_min_limit"', () => {
        mock_props.visibility_status = ['advert_min_limit'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.'
            )
        ).toBeInTheDocument();
    });
    it('should display the error message for "advert_remaining"', () => {
        mock_props.visibility_status = ['advert_remaining'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount (100 USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the error message for "advertiser_ads_paused"', () => {
        mock_props.visibility_status = ['advertiser_ads_paused'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText('This ad is not listed on Buy/Sell because you have paused all your ads.')
        ).toBeInTheDocument();
    });
    it('should display the error message for "advertiser_balance"', () => {
        mock_props.visibility_status = ['advertiser_balance'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance ( USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the error message for "advertiser_daily_limit"', () => {
        mock_props.visibility_status = ['advertiser_daily_limit'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText(
                'This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit ( USD).'
            )
        ).toBeInTheDocument();
    });
    it('should display the error message for "advertiser_temp_ban"', () => {
        mock_props.visibility_status = ['advertiser_temp_ban'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText(
                'You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.'
            )
        ).toBeInTheDocument();
    });
    it('should handle the error message when there are multiple visibility statuses', () => {
        mock_props.visibility_status = ['advertiser_temp_ban', 'advert_inactive'];
        render(<AdErrorTooltipModal {...mock_props} />, { wrapper });
        expect(
            screen.getByText('Your ad isn’t listed on Buy/Sell due to the following reason(s):')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '1. You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '2. Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.'
            )
        ).toBeInTheDocument();
    });
});
