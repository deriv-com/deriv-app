import React from 'react';
import { localize } from '@deriv/translations';
import StaticDashboard from 'Components/onboarding-new/static-dashboard';

type TStep = {
    component: React.ReactNode;
    eu_footer_header?: string;
    footer_header: string;
    eu_footer_text?: string;
    footer_text: string;
    next_content?: string;
    has_next_content: boolean;
};

type TTradingHubContents = Record<'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6', TStep>;

export const getTradingHubContents = (): TTradingHubContents => ({
    step1: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: false,
                    item: false,
                    get: false,
                    text: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: false,
                    options_item: false,
                    options_text: false,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: false,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        ),
        footer_header: localize("Welcome to Trader's hub"),
        footer_text: localize('This is your personal start page for Deriv'),
        has_next_content: false,
    },
    step2: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: false,
                    item: false,
                    get: false,
                    text: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: true,
                    options_item: false,
                    options_text: true,
                    cfd_description: false,
                    options_description: true,
                    platformlauncher: true,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        ),
        footer_header: localize('Trading accounts'),
        footer_text: localize(
            `These are the trading accounts available to you. You can click on an account’s icon or description to find out more`
        ),
        has_next_content: false,
    },
    step3: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: true,
                    item: true,
                    get: true,
                    text: false,
                    topup: false,
                    trade: false,
                    cfd_item: true,
                    cfd_text: false,
                    options_item: true,
                    options_text: false,
                    cfd_description: true,
                    options_description: true,
                    platformlauncher: true,
                }}
                is_onboarding_animated={{
                    text: true,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
            />
        ),
        footer_header: localize('CFDs, Options or Multipliers'),
        eu_footer_header: localize('CFDs or Multipliers'),
        footer_text: localize('You can choose between CFD trading accounts or Options and Multipliers accounts'),
        eu_footer_text: localize('You can choose between CFD trading accounts and Multipliers accounts'),
        has_next_content: false,
    },
    step4: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: false,
                    item: false,
                    get: false,
                    text: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: true,
                    options_item: false,
                    options_text: true,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: true,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: true,
                    get: true,
                }}
            />
        ),
        footer_header: localize('‘Get’ the accounts you want'),
        footer_text: localize('Click the ‘Get’ button to create an account'),
        has_next_content: false,
    },
    step5: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: false,
                    item: false,
                    get: true,
                    text: false,
                    topup: false,
                    trade: true,
                    cfd_item: false,
                    cfd_text: true,
                    options_item: false,
                    options_text: true,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: true,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: true,
                    button: false,
                    get: false,
                }}
                is_grey
                has_account
                currency={'USD'}
                mf_currency={'EUR'}
                derived_amount={'0'}
                financial_amount={'0'}
                loginid={'20884385'}
                has_applauncher_account
                is_derivx_last_step
                is_financial_last_step
            />
        ),
        footer_header: localize('Top-up your account'),
        footer_text: localize('Once you have an account click on ‘Deposit’ or ‘Transfer’ to add funds to an account'),
        has_next_content: false,
    },
    step6: {
        component: (
            <StaticDashboard
                is_blurry={{
                    icon: false,
                    item: false,
                    get: true,
                    text: false,
                    topup: true,
                    trade: false,
                    cfd_item: false,
                    cfd_text: true,
                    options_item: false,
                    options_text: true,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: false,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: true,
                    topup: false,
                    button: false,
                    get: false,
                }}
                is_grey
                has_account
                currency={'USD'}
                mf_currency={'EUR'}
                derived_amount={'0'}
                financial_amount={'0'}
                loginid={'20884385'}
                has_applauncher_account
                is_derivx_last_step
                is_financial_last_step
            />
        ),
        footer_header: localize('Start trading'),
        footer_text: localize('Click ‘Trade’ to start trading with your account'),
        has_next_content: true,
        next_content: localize('Start trading'),
    },
});
