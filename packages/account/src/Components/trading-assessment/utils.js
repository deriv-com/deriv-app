import { localize } from '@deriv/translations';
import { nanoid } from 'nanoid';

export const trading_assessment = [
    {
        question_text: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
        answer_options: [
            { id: nanoid(), value: 'Yes', label: localize('Yes') },
            { id: nanoid(), value: 'No', label: localize('No') },
        ],
    },
    {
        question_text: 'How much knowledge and experience do you have in relation to online trading?',
        answer_options: [
            {
                id: nanoid(),
                value: 'I have an academic degree, professional certification, and/or work experience related to financial services.',
                label: localize(
                    'I have an academic degree, professional certification, and/or work experience related to financial services.'
                ),
            },
            {
                id: nanoid(),
                value: 'I trade forex CFDs and other complex financial instruments regularly on other platforms.',
                label: localize(
                    'I trade forex CFDs and other complex financial instruments regularly on other platforms.'
                ),
            },
        ],
    },
    {
        question_text: 'In your understanding, CFD trading allows you to',
        answer_options: [
            {
                id: nanoid(),
                value: 'Purchase commodities or shares of a company.',
                label: localize('Purchase commodities or shares of a company.'),
            },
            {
                id: nanoid(),
                value: 'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.',
                label: localize(
                    'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.'
                ),
            },
            {
                id: nanoid(),
                value: 'Speculate on the price movement of an asset without actually owning it.',
                label: localize('Speculate on the price movement of an asset without actually owning it.'),
            },
            {
                id: nanoid(),
                value: 'Make a long-term investment for a guaranteed profit.',
                label: localize('Make a long-term investment for a guaranteed profit.'),
            },
        ],
    },
    {
        question_text: 'How does leverage affect CFD trading?',
        answer_options: [
            {
                id: nanoid(),
                value: 'Leverage helps to mitigate risk.',
                label: localize('Leverage helps to mitigate risk.'),
            },
            {
                id: nanoid(),
                value: 'Leverage prevents you from opening large positions.',
                label: localize('Leverage prevents you from opening large positions.'),
            },
            { id: nanoid(), label: 'Leverage guarantees profits.' },
            {
                id: nanoid(),
                value: 'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.',
                label: localize(
                    'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.'
                ),
            },
        ],
    },
    {
        question_text:
            'Leverage trading is high-risk, so it’s a good idea to use risk management features such as stop loss. Stop loss allows you to',
        answer_options: [
            {
                id: nanoid(),
                value: 'Cancel your trade at any time within a specified timeframe.',
                label: localize('Cancel your trade at any time within a specified timeframe.'),
            },
            {
                id: nanoid(),
                value: 'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                label: localize(
                    'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
            },
            {
                id: nanoid(),
                value: 'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                label: localize(
                    'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
            },
            {
                id: nanoid(),
                value: 'Make a guaranteed profit on your trade.',
                label: localize('Make a guaranteed profit on your trade.'),
            },
        ],
    },
    {
        question_text: 'When do you need to pay an initial margin?',
        answer_options: [
            {
                id: nanoid(),
                value: 'When opening a leveraged CFD trade',
                label: localize('When opening a leveraged CFD trade'),
            },
            { id: nanoid(), value: 'When trading multipliers', label: 'When trading multipliers' },
            {
                id: nanoid(),
                value: 'When buying shares of a company',
                label: localize('When buying shares of a company'),
            },
            { id: nanoid(), value: 'All of the above', label: localize('All of the above') },
        ],
    },
];

export const cfd_trading_experience = {
    question_text: localize('How much experience do you have in CFD trading?'),
    answer_options: [
        {
            text: localize('No experience'),
            value: 'No experience',
        },
        {
            text: localize('Less than a year'),
            value: 'Less than a year',
        },
        {
            text: localize('1-2 years'),
            value: '1-2 years',
        },
        {
            text: localize('Over 3 years'),
            value: 'Over 3 years',
        },
    ],
};

export const cfd_trades_placed = {
    question_text: localize('How many CFD trades have you placed in the past 12 months?'),
    answer_options: [
        {
            text: localize('None'),
            value: 'None',
        },
        {
            text: '1-5',
            value: '1-5',
        },
        {
            text: '6-10',
            value: '6-10',
        },
        {
            text: '11-39',
            value: '11-39',
        },
        {
            text: localize('40 or more'),
            value: '40 or more',
        },
    ],
};

export const other_trading_experiences = {
    question_text: localize('How much experience do you have with other financial instruments?'),
    answer_options: [
        {
            text: localize('No experience'),
            value: 'No experience',
        },
        {
            text: localize('Less than a year'),
            value: 'Less than a year',
        },
        {
            text: localize('1-2 years'),
            value: '1-2 years',
        },
        {
            text: localize('Over 3 years'),
            value: 'Over 3 years',
        },
    ],
};

export const trading_frequencies_past_12_months = {
    question_text: localize('How many trades have you placed with other financial instruments in the past 12 months?'),
    answer_options: [
        {
            text: localize('None'),
            value: '',
        },
        {
            text: '1-5',
            value: '1-5',
        },
        {
            text: '6-10',
            value: '6-10',
        },
        {
            text: '11-39',
            value: '11-39',
        },
        {
            text: localize('40 or more'),
            value: '40 or more',
        },
    ],
};

export const CFD_trading_allows_you = {
    question_text: localize('In your understanding, CFD trading allows you to'),
    answer_options: [
        {
            text: localize('Purchase commodities or shares of a company.'),
            value: 'Purchase commodities or shares of a company.',
        },
        {
            text: localize(
                'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.'
            ),
            value: 'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.',
        },
        {
            text: localize('Speculate on the price movement of an asset without actually owning it.'),
            value: 'Speculate on the price movement of an asset without actually owning it.',
        },
        {
            text: localize('Make a long-term investment for a guaranteed profit.'),
            value: 'Make a long-term investment for a guaranteed profit.',
        },
    ],
};
