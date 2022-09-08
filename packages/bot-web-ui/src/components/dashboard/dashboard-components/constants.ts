import { localize } from '@deriv/translations';

export type TSidebarItem = {
    label: string;
    content: string[];
};

export const SIDEBAR_INTRO: TSidebarItem[] = [
    {
        label: localize('Welcome to DBot, [name]!'),
        content: [
            localize(
                'Ready to automate your trading strategy without writing any code? You’ve come to the right place.'
            ),
            localize('Check out these guides and FAQs to learn more about building your bot:'),
        ],
    },
    {
        label: localize('Guide'),
        content: [
            localize('DBot - your automated trading partner'),
            localize('How to build your bot from scratch using a simple strategy.'),
        ],
    },
    {
        label: localize('FAQs'),
        content: [
            localize('What is DBot?'),
            localize('Where do I find the blocks I need?'),
            localize('How do I remove blocks from the workspace?'),
        ],
    },
];

export const JOYRIDE_CONFIG = [
    {
        target: 'body',
        label: localize('Start with a tempplate'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
    {
        target: '#id-quick-strategy',
        label: localize('Start with a template'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
    {
        target: '#id-bot-builder',
        label: localize('Start with a tempplate'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
    {
        target: '#id-charts',
        label: localize('Start with a tempplate'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
    {
        target: '#id-tutorials',
        label: localize('Start with a tempplate'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
    {
        target: '#dc-tabs__content_group_tiles',
        label: localize('Start with a tempplate'),
        content: localize(
            'Load a template containing the Martingale, D’Alembert, or Oscar’s Grind strategy, and modify it as you wish.'
        ),
    },
];
