import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const trading_assessment_questions = () => [
    {
        question_text: localize(
            'Do you understand that you could potentially lose 100% of the money you use to trade?'
        ),
        section: 'risk_tolerance',
        answer_options: [
            { text: localize('Yes'), value: 'Yes' },
            { text: localize('No'), value: 'No' },
        ],
        form_control: 'risk_tolerance',
        field_type: 'radio',
    },
    {
        question_text: localize('How much knowledge and experience do you have in relation to online trading?'),
        section: 'source_of_experience',
        form_control: 'source_of_experience',
        answer_options: [
            {
                text: localize(
                    'I have an academic degree, professional certification, and/or work experience related to financial services.'
                ),
                value: 'I have an academic degree, professional certification, and/or work experience.',
            },
            {
                text: localize(
                    'I trade forex CFDs and other complex financial instruments regularly on other platforms.'
                ),
                value: 'I trade forex CFDs and other complex financial instruments.',
            },
            {
                text: localize('I have attended seminars, training, and/or workshops related to trading.'),
                value: 'I have attended seminars, training, and/or workshops.',
            },
            {
                text: localize('I am interested in trading but have very little experience.'),
                value: 'I have little experience.',
            },
            {
                text: localize('I have no knowledge and experience in trading at all.'),
                value: 'I have no knowledge.',
            },
        ],
        field_type: 'radio',
    },
    {
        section: 'trading_experience',
        questions: [
            {
                question_text: localize('How much experience do you have in CFD trading?'),
                field_type: 'dropdown',
                form_control: 'cfd_experience',
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
                        text: localize('1 - 2 years'),
                        value: '1 - 2 years',
                    },
                    {
                        text: localize('Over 3 years'),
                        value: 'Over 3 years',
                    },
                ],
            },
            {
                question_text: localize('How many CFD trades have you placed in the past 12 months?'),
                field_type: 'dropdown',
                form_control: 'cfd_frequency',
                answer_options: [
                    {
                        text: localize('None'),
                        value: 'No transactions in the past 12 months',
                    },
                    {
                        text: '1 - 5',
                        value: '1 - 5 transactions in the past 12 months',
                    },
                    {
                        text: '6 - 10',
                        value: '6 - 10 transactions in the past 12 months',
                    },
                    {
                        text: '11 - 39',
                        value: '11 - 39 transactions in the past 12 months',
                    },
                    {
                        text: localize('40 or more'),
                        value: '40 transactions or more in the past 12 months',
                    },
                ],
            },
            {
                question_text: localize('How much experience do you have with other financial instruments?'),
                field_type: 'dropdown',
                form_control: 'trading_experience_financial_instruments',
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
                        text: localize('1 - 2 years'),
                        value: '1 - 2 years',
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
                form_control: 'trading_frequency_financial_instruments',
                field_type: 'dropdown',
                answer_options: [
                    {
                        text: localize('None'),
                        value: 'No transactions in the past 12 months',
                    },
                    {
                        text: '1 - 5',
                        value: '1 - 5 transactions in the past 12 months',
                    },
                    {
                        text: '6 - 10',
                        value: '6 - 10 transactions in the past 12 months',
                    },
                    {
                        text: '11 - 39',
                        value: '11 - 39 transactions in the past 12 months',
                    },
                    {
                        text: localize('40 or more'),
                        value: '40 transactions or more in the past 12 months',
                    },
                ],
            },
        ],
    },
    {
        question_text: localize('In your understanding, CFD trading allows you to'),
        section: 'trading_knowledge',
        form_control: 'cfd_trading_definition',
        field_type: 'radio',
        answer_options: [
            {
                text: localize('Purchase commodities or shares of a company.'),
                value: 'Purchase shares of a company or physical commodities.',
            },
            {
                text: localize(
                    'Place a position on the price movement of an asset where the outcome is a fixed return or nothing at all.'
                ),
                value: 'Place a bet on the price movement.',
            },
            {
                text: localize('Speculate on the price movement of an asset without actually owning it.'),
                value: 'Speculate on the price movement.',
            },
            {
                text: localize('Make a long-term investment for a guaranteed profit.'),
                value: 'Make a long-term investment.',
            },
        ],
    },
    {
        question_text: localize('How does leverage affect CFD trading?'),
        section: 'trading_knowledge',
        form_control: 'leverage_impact_trading',
        field_type: 'radio',
        answer_options: [
            {
                text: localize('Leverage helps to mitigate risk.'),
                value: 'Leverage is a risk mitigation technique.',
            },
            {
                text: localize('Leverage prevents you from opening large positions.'),
                value: 'Leverage prevents you from opening large positions.',
            },
            { text: localize('Leverage guarantees profits.'), value: 'Leverage guarantees profits.' },
            {
                text: localize(
                    'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.'
                ),
                value: "Leverage lets you open larger positions for a fraction of the trade's value.",
            },
        ],
    },
    {
        question_text: localize(
            "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to"
        ),
        section: 'trading_knowledge',
        form_control: 'leverage_trading_high_risk_stop_loss',
        field_type: 'radio',
        answer_options: [
            {
                text: localize('Cancel your trade at any time within a specified timeframe.'),
                value: 'Cancel your trade at any time within a chosen timeframe.',
            },
            {
                text: localize(
                    'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
                value: 'Close your trade automatically when the loss is more than or equal to a specific amount.',
            },
            {
                text: localize(
                    'Close your trade automatically when the profit is equal to or more than a specified amount, as long as there is adequate market liquidity.'
                ),
                value: 'Close your trade automatically when the profit is more than or equal to a specific amount.',
            },
            {
                text: localize('Make a guaranteed profit on your trade.'),
                value: 'Make a guaranteed profit on your trade.',
            },
        ],
    },
    {
        question_text: localize('When are you required to pay an initial margin?'),
        section: 'trading_knowledge',
        form_control: 'required_initial_margin',
        field_type: 'radio',
        answer_options: [
            {
                text: localize('When opening a leveraged CFD trade.'),
                value: 'When opening a Leveraged CFD trade.',
            },
            { text: localize('When trading multipliers.'), value: 'When trading Multipliers.' },
            {
                text: localize('When buying shares of a company.'),
                value: 'When buying shares of a company.',
            },
            { text: localize('All of the above.'), value: 'All of the above.' },
        ],
    },
];

const default_form_config = {
    supported_in: ['maltainvest'],
};

export const getTradingAssessmentFormConfig = financial_assessment => {
    return {
        risk_tolerance: {
            ...default_form_config,
            default_value: financial_assessment?.risk_tolerance ?? '',
        },
        source_of_experience: {
            ...default_form_config,
            default_value: financial_assessment?.source_of_experience ?? '',
        },
        cfd_experience: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_experience ?? '',
        },
        cfd_frequency: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_frequency ?? '',
        },
        trading_experience_financial_instruments: {
            ...default_form_config,
            default_value: financial_assessment?.trading_experience_financial_instruments ?? '',
        },
        trading_frequency_financial_instruments: {
            ...default_form_config,
            default_value: financial_assessment?.trading_frequency_financial_instruments ?? '',
        },
        cfd_trading_definition: {
            ...default_form_config,
            default_value: financial_assessment?.cfd_trading_definition ?? '',
        },
        leverage_impact_trading: {
            ...default_form_config,
            default_value: financial_assessment?.leverage_impact_trading ?? '',
        },
        leverage_trading_high_risk_stop_loss: {
            ...default_form_config,
            default_value: financial_assessment?.leverage_trading_high_risk_stop_loss ?? '',
        },
        required_initial_margin: {
            ...default_form_config,
            default_value: financial_assessment?.required_initial_margin ?? '',
        },
    };
};

const tradingAssessmentConfig = (
    { real_account_signup_target, financial_assessment, account_settings, setSubSectionIndex },
    TradingAssessmentNewUser
) => {
    const trading_assessment_form_config = getTradingAssessmentFormConfig(financial_assessment);
    return {
        header: {
            active_title: localize('Complete your trading assessment'),
            title: localize('Trading assessment'),
        },
        body: TradingAssessmentNewUser,
        form_value: getDefaultFields(real_account_signup_target, trading_assessment_form_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, trading_assessment_form_config),
            assessment_questions: trading_assessment_questions(),
            disabled_items: account_settings?.immutable_fields,
            setSubSectionIndex,
        },
        sub_step_count: trading_assessment_questions().length,
    };
};

export default tradingAssessmentConfig;
