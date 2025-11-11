import { localize } from '@deriv/translations';

type TFinancialAssessmentAnswer = {
    hide_if: string[];
    key: string;
    next_node: string | null;
    value: string;
};

type TFinancialAssessmentQuestion = {
    answers: TFinancialAssessmentAnswer[];
    hide_if: string[];
    question: string;
    type: 'single_choice' | 'multiple_choice';
};

type TFinancialAssessmentQuestions = {
    questions: {
        employment_industry: TFinancialAssessmentQuestion;
        employment_status: TFinancialAssessmentQuestion;
        estimated_worth: TFinancialAssessmentQuestion;
        income_source: TFinancialAssessmentQuestion;
        investment_intention: TFinancialAssessmentQuestion;
        net_income: TFinancialAssessmentQuestion;
        occupation: TFinancialAssessmentQuestion;
        source_of_wealth: TFinancialAssessmentQuestion;
    };
    version: string;
};

type TGetDropdownList = {
    financial_questions: TFinancialAssessmentQuestions;
};

export const getAccountOpeningReasonList = () => [
    {
        text: localize('Hedging'),
        value: 'Hedging',
    },
    {
        text: localize('Income Earning'),
        value: 'Income Earning',
    },
    {
        text: localize('Speculative'),
        value: 'Speculative',
    },
];

const transformAnswersToDropdownList = (answers: Array<{ key: string; value: string }>) => {
    return answers.map(answer => ({
        text: answer.value,
        value: answer.key,
    }));
};

export const getEmploymentStatusList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.employment_status?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.employment_status.answers);
};

export const getEmploymentIndustryList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.employment_industry?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.employment_industry.answers);
};

export const getIncomeSourceList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.income_source?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.income_source.answers);
};

export const getNetIncomeList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.net_income?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.net_income.answers);
};

export const getEstimatedWorthList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.estimated_worth?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.estimated_worth.answers);
};

export const getAccountTurnoverList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.investment_intention?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.investment_intention.answers);
};

export const getSourceOfWealthList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.source_of_wealth?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.source_of_wealth.answers);
};

export const getOccupationList = ({ financial_questions }: TGetDropdownList) => {
    if (!financial_questions?.questions?.occupation?.answers) {
        return [];
    }
    return transformAnswersToDropdownList(financial_questions.questions.occupation.answers);
};
