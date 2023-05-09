import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DMT5TradeModal from '../dmt5-trade-modal';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

jest.mock('../../Assets/svgs/trading-platform', () => {
    const mock_icon_component = ({ icon }: { icon: string }) => <div>{icon}</div>;

    return mock_icon_component;
});

describe('DMT5TradeModal', () => {
    const mockMt5TradeAccount: Required<DetailsOfEachMT5Loginid> = {
        account_type: 'demo',
        market_type: 'financial',
        landing_company_short: 'labuan',
        sub_account_type: 'standard',
        display_balance: '123.45',
        currency: 'USD',
        balance: 0,
        country: '',
        email: '',
        error: {
            code: undefined,
            details: undefined,
            message_to_client: undefined,
        },
        group: '',
        leverage: 0,
        login: '',
        name: '',
        server: '',
        server_info: {
            environment: undefined,
            geolocation: undefined,
            id: undefined,
        },
        status: null,
        sub_account_category: '',
    };
    const mockOnPasswordManager = jest.fn();
    const mockToggleModal = jest.fn();
    const mock_dxtrade_tokens = {
        demo: '',
        real: '',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render DMT5TradeModal', () => {
        render(
            <DMT5TradeModal
                mt5_trade_account={mockMt5TradeAccount}
                show_eu_related_content={false}
                onPasswordManager={mockOnPasswordManager}
                toggleModal={mockToggleModal}
                dxtrade_tokens={mock_dxtrade_tokens}
            />
        );

        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText(/123.45/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should show the correct title for non-EU accounts when market_type is synthetic', () => {
        render(
            <DMT5TradeModal
                mt5_trade_account={mockMt5TradeAccount}
                show_eu_related_content={false}
                onPasswordManager={mockOnPasswordManager}
                toggleModal={mockToggleModal}
                dxtrade_tokens={mock_dxtrade_tokens}
            />
        );
        expect(screen.getByText('Financial')).toBeInTheDocument();
    });

    it('should show the correct title for non-EU accounts when market_type is synthetic', () => {
        mockMt5TradeAccount.market_type = 'synthetic';
        render(
            <DMT5TradeModal
                mt5_trade_account={mockMt5TradeAccount}
                show_eu_related_content={false}
                onPasswordManager={mockOnPasswordManager}
                toggleModal={mockToggleModal}
                dxtrade_tokens={mock_dxtrade_tokens}
            />
        );
        expect(screen.getByText('Derived')).toBeInTheDocument();
    });

    it('should show the correct title for EU accounts', () => {
        render(
            <DMT5TradeModal
                mt5_trade_account={mockMt5TradeAccount}
                show_eu_related_content={true}
                onPasswordManager={mockOnPasswordManager}
                toggleModal={mockToggleModal}
                dxtrade_tokens={mock_dxtrade_tokens}
            />
        );
        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    it('should call onPasswordManager when the password edit button is clicked and close it with Toggle Modal', () => {
        render(
            <DMT5TradeModal
                mt5_trade_account={mockMt5TradeAccount}
                show_eu_related_content={false}
                onPasswordManager={mockOnPasswordManager}
                toggleModal={mockToggleModal}
                dxtrade_tokens={mock_dxtrade_tokens}
            />
        );
        const passwordEditButton = screen.getByTestId('dt_cfd_trade_modal_password_action');
        fireEvent.click(passwordEditButton);
        expect(mockOnPasswordManager).toHaveBeenCalledTimes(1);
        expect(mockToggleModal).toHaveBeenCalledTimes(1);
    });
});
