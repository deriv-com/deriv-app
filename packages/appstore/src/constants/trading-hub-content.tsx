import React from 'react';
import { localize } from '@deriv/translations';
import StaticDashboard from 'Components/onboarding/static-dashboard';

type TStep = {
    component: React.ReactNode;
    footer_header: string;
    footer_text: string;
    next_content?: string;
    has_next_content: boolean;
};

type TTradingHubContents = Record<'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6', TStep>;

export const trading_hub_contents: TTradingHubContents = {
    step1: {
        component: <StaticDashboard />,
        footer_header: localize('Welcome to Trading Hub'),
        footer_text: localize('This is your new dashboard'),
        has_next_content: false,
    },
    step2: {
        component: (
            <StaticDashboard
                is_cfd_text_blurry
                is_options_text_blurry
                is_platformlauncher_blurry
                is_button_animated
                is_options_description_blurry
            />
        ),
        footer_header: localize('Trading accounts'),
        footer_text: localize(
            'These are the trading accounts available to you. You can click on an account to find out more.'
        ),
        has_next_content: false,
    },
    step3: {
        component: (
            <StaticDashboard
                is_cfd_item_blurry
                is_options_item_blurry
                is_platformlauncher_blurry
                is_get_blurry
                is_icon_blurry
                is_text_animated
                is_cfd_description_blurry
                is_options_description_blurry
            />
        ),
        footer_header: localize('CFDs, Options or Multipliers'),
        footer_text: localize('You can choose between CFD trading accounts or Options and Multipliers accounts'),
        has_next_content: false,
    },
    step4: {
        component: (
            <StaticDashboard is_cfd_text_blurry is_options_text_blurry is_platformlauncher_blurry is_button_animated />
        ),
        footer_header: localize('‘Get’ the accounts you want'),
        footer_text: localize('Click the ‘Get’ button to create an account'),
        has_next_content: false,
    },
    step5: {
        component: (
            <StaticDashboard
                is_grey
                has_account
                currency={'USD'}
                derived_amount={'369'}
                loginid={'20884385'}
                is_trade_blurry
                is_topup_animated
                is_cfd_text_blurry
                is_options_text_blurry
                has_applauncher_account
                is_last_step
                is_get_blurry
                is_derivx_last_step
                is_financial_last_step
            />
        ),
        footer_header: localize('Top-up your account'),
        footer_text: localize('Once you have an account click ‘Top-up’ to add funds '),
        has_next_content: false,
    },
    step6: {
        component: (
            <StaticDashboard
                is_grey
                has_account
                currency={'USD'}
                financial_amount={'512'}
                loginid={'20884385'}
                is_topup_blurry
                is_trade_animated
                is_cfd_text_blurry
                is_options_text_blurry
                has_applauncher_account
                is_last_step
                is_get_blurry
                is_derivx_last_step
                is_financial_last_step
            />
        ),
        footer_header: localize('Start trading'),
        footer_text: localize('Click ‘Trade’ to start trading with your account'),
        has_next_content: true,
        next_content: localize('Start trading'),
    },
};
