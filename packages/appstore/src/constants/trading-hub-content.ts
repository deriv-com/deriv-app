import { localize } from '@deriv/translations';
import React from 'react';

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
        component: 'Step1',
        footer_header: localize('Welcome to Trading Hub'),
        footer_text: localize('This is your new dashboard'),
        has_next_content: false,
    },
    step2: {
        component: 'Step2',
        footer_header: localize('Trading accounts'),
        footer_text: localize(
            'These are the trading accounts available to you. You can click on an account to find out more.'
        ),
        has_next_content: false,
    },
    step3: {
        component: 'Step3',
        footer_header: localize('CFDs, Options or Multipliers'),
        footer_text: localize('You can choose between CFD trading accounts or Options and Multipliers accounts'),
        has_next_content: false,
    },
    step4: {
        component: 'Step4',
        footer_header: localize('‘Get’ the accounts you want'),
        footer_text: localize('Click the ‘Get’ button to create an account'),
        has_next_content: false,
    },
    step5: {
        component: 'Step5',
        footer_header: localize('Top-up your account'),
        footer_text: localize('Once you have an account click ‘Top-up’ to add funds '),
        has_next_content: false,
    },
    step6: {
        component: 'Step6',
        footer_header: localize('Start trading'),
        footer_text: localize('Click ‘Trade’ to start trading with your account'),
        has_next_content: true,
        next_content: localize('Start trading'),
    },
};
