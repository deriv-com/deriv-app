import { localize } from '@deriv/translations';

export const trading_assessment = [
    {
        question_text: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
        type: 'radio',
        answer_options: [
            { value: 'Yes', text: localize('Yes') },
            { value: 'No', text: localize('No') },
        ],
        answer: 'Yes',
    },
    {
        question_text: 'How much knowledge and experience do you have in relation to online trading?',
        type: 'radio',
        answer_options: [
            {
                value: 'I have an academic degree, professional certification, and/or work experience related to financial services.',
                text: localize(
                    'I have an academic degree, professional certification, and/or work experience related to financial services.'
                ),
            },
            {
                value: 'I trade forex CFDs and other complex financial instruments regularly on other platforms.',
                text: localize(
                    'I trade forex CFDs and other complex financial instruments regularly on other platforms.'
                ),
            },
            {
                value: 'I have attended seminars, training, and/or workshops related to trading.',
                text: localize('I have attended seminars, training, and/or workshops related to trading.'),
            },
            {
                value: 'I am interested in trading but have very little experience.',
                text: localize('I am interested in trading but have very little experience.'),
            },
            {
                value: 'I have no knowledge and experience in trading at all.',
                text: localize('I have no knowledge and experience in trading at all.'),
            },
        ],
        answer: [
            'I have an academic degree, professional certification, and/or work experience related to financial services.',
            'I trade forex CFDs and other complex financial instruments regularly on other platforms.',
            'I have attended seminars, training, and/or workshops related to trading.',
        ],
    },
    // start dropdown
    {
        type: 'dropdown',
        questions: [
            {
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
            },
            {
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
            },
            {
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
            },
            {
                question_text: localize(
                    'How many trades have you placed with other financial instruments in the past 12 months?'
                ),

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
            },
        ],
    },
    // end
    {
        question_text: 'In your understanding, CFD trading allows you to',
        type: 'radio',
        answer_options: [
            {
                value: 'Purchase commodities or shares of a company.',
                text: localize('Purchase commodities or shares of a company.'),
            },
            {
                value: 'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.',
                text: localize(
                    'Place a bet on the price movement of an asset where the outcome is a fixed return or nothing at all.'
                ),
            },
            {
                value: 'Speculate on the price movement of an asset without actually owning it.',
                text: localize('Speculate on the price movement of an asset without actually owning it.'),
            },
            {
                value: 'Make a long-term investment for a guaranteed profit.',
                text: localize('Make a long-term investment for a guaranteed profit.'),
            },
        ],
        answer: 'Speculate on the price movement of an asset without actually owning it.',
    },
    {
        question_text: 'How does leverage affect CFD trading?',
        type: 'radio',
        answer_options: [
            {
                value: 'Leverage helps to mitigate risk.',
                text: localize('Leverage helps to mitigate risk.'),
            },
            {
                value: 'Leverage prevents you from opening large positions.',
                text: localize('Leverage prevents you from opening large positions.'),
            },
            { text: 'Leverage guarantees profits.' },
            {
                value: 'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.',
                text: localize(
                    'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.'
                ),
            },
        ],
        answer: 'Leverage prevents you from opening large positions.',
    },
    {
        question_text:
            'Leverage trading is high-risk, so it’s a good idea to use risk management features such as stop loss. Stop loss allows you to',
        type: 'radio',
        answer_options: [
            {
                value: 'Cancel your trade at any time within a specified timeframe.',
                text: localize('Cancel your trade at any time within a specified timeframe.'),
            },
            {
                value: 'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                text: localize(
                    'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
            },
            {
                value: 'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.',
                text: localize(
                    'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
            },
            {
                value: 'Make a guaranteed profit on your trade.',
                text: localize('Make a guaranteed profit on your trade.'),
            },
        ],
        answer: 'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.',
    },
    {
        question_text: 'When do you need to pay an initial margin?',
        type: 'radio',
        answer_options: [
            {
                value: 'When opening a leveraged CFD trade',
                text: localize('When opening a leveraged CFD trade'),
            },
            { value: 'When trading multipliers', text: 'When trading multipliers' },
            {
                value: 'When buying shares of a company',
                text: localize('When buying shares of a company'),
            },
            { value: 'All of the above', text: localize('All of the above') },
        ],
        answer: 'When opening a leveraged CFD trade',
    },
];
