import { useQuery } from '@deriv/api';

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

type TFinancialAssessmentQuestionsResponse = {
    financial_assessment_questions: TFinancialAssessmentQuestions;
    msg_type: 'financial_assessment_questions';
    req_id: number;
};

/** A custom hook that gets the financial assessment questions. */
const useFinancialAssessmentQuestions = () => {
    // @ts-expect-error - 'financial_assessment_questions' is a valid endpoint but not yet typed in the API types
    const { data, ...rest } = useQuery('financial_assessment_questions', {
        payload: {
            financial_assessment_questions: 1,
            version: 'v2',
        },
    });

    return {
        /** The financial assessment questions data */
        data: (data as TFinancialAssessmentQuestionsResponse)?.financial_assessment_questions ?? null,
        /** The raw response data */
        raw_data: data as TFinancialAssessmentQuestionsResponse | undefined,
        ...rest,
    };
};

export default useFinancialAssessmentQuestions;
