import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingAppCard from '../trading-app-card';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({
        text: 'Pending verification',
        icon: 'IcAlertWarning',
    })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(() => ({ eligible_account_to_migrate_label: 'BVI' })),
}));

describe('<TradingAppCard/>', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof TradingAppCard> = {
        availability: 'Non-EU',
        name: '0.00 USD',
        icon: 'Derived',
        action_type: 'multi-action',
        clickable_icon: false,
        description: 'Trade CFDs on MT5 with synthetics, baskets, and derived FX.',
        is_deriv_platform: false,
        onAction: jest.fn(),
        sub_title: 'Derived',
        has_divider: false,
        platform: 'mt5',
        short_code_and_region: 'SVG',
        mt5_acc_auth_status: null,
        selected_mt5_jurisdiction: {
            platform: 'mt5',
            category: 'real',
            type: 'synthetic',
            jurisdiction: 'svg',
        },
        openFailedVerificationModal: jest.fn(),
        is_open_order_position_status_present: true,
        open_order_position_status: true,
        market_type: 'synthetic',
    };

    const store_config = mockStore({
        common: {
            current_language: 'EN',
        },
        traders_hub: {
            is_eu_user: false,
            is_demo_low_risk: false,
            content_flag: 'low_risk_cr_non_eu',
            is_real: true,
        },
    });

    const renderComponent = ({ props = mock_props }) => {
        render(
            <StoreProvider store={store_config}>
                <APIProvider>
                    <TradingAppCard {...props} />
                </APIProvider>
            </StoreProvider>
        );
    };
    it('should render correct status badge if open_order_position_status is present in BE response and open_order_position_status is true', () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText(/No new positions/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should render correct status badge if open_order_position_status is present in BE response and open_order_position_status is true', () => {
        const new_mock_props = {
            ...mock_props,
            open_order_position_status: false,
        };
        renderComponent({ props: new_mock_props });

        const status_badge = screen.getByText(/Account closed/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should open OpenPositionsSVGModal when user clicks on the badge', async () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText(/No new positions/);
        await userEvent.click(status_badge);

        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Derived SVG account. Please use your MT5 Derived BVI account to open new positions./
        );
        expect(modal_content_bvi).toBeInTheDocument();
    });

    it('should close OpenPositionsSVGModal when user clicks on the OK', async () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText('No new positions');
        await userEvent.click(status_badge);

        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Derived SVG account. Please use your MT5 Derived BVI account to open new positions./
        );
        const okButton = screen.getByRole('button', { name: /OK/i });
        userEvent.click(okButton);
        expect(modal_content_bvi).not.toBeInTheDocument();
    });
});
