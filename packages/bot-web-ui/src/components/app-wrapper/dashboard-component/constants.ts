import { localize } from '@deriv/translations';

export type TSidebarItem = {
    label: string;
    content: string[];
    link: boolean;
};

export const SIDEBAR_INTRO: TSidebarItem[] = [
    {
        label: localize('Welcome to Deriv Bot!'),
        content: [
            localize(
                'Ready to automate your trading strategy without writing any code? You’ve come to the right place.'
            ),
            localize('Check out these guides and FAQs to learn more about building your bot:'),
        ],
        link: false,
    },
    {
        label: localize('Guide'),
        content: [localize('Deriv Bot - your automated trading partner')],
        link: true,
    },
    {
        label: localize('FAQs'),
        content: [
            localize('What is Deriv Bot?'),
            localize('Where do I find the blocks I need?'),
            localize('How do I remove blocks from the workspace?'),
        ],
        link: true,
    },
];
