import { localize } from '@deriv/translations';

export type TSidebarItem = {
    label: string;
    content: string[];
};

export const sidebar_intro: TSidebarItem[] = [
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
