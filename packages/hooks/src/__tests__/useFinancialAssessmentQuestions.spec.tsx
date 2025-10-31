import React from 'react';

import { useQuery } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useFinancialAssessmentQuestions from '../useFinancialAssessmentQuestions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

describe('useFinancialAssessmentQuestions', () => {
    const mockStoreData = mockStore({
        client: { is_authorize: true },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStoreData}>{children}</StoreProvider>
    );

    const mockFinancialAssessmentQuestions = {
        questions: {
            employment_status: {
                answers: [
                    {
                        hide_if: [],
                        key: 'full_time',
                        next_node: 'employment_industry',
                        value: 'Employed full-time',
                    },
                    {
                        hide_if: [],
                        key: 'part_time',
                        next_node: 'employment_industry',
                        value: 'Employed part-time',
                    },
                ],
                hide_if: [],
                question: 'Employment Status',
                type: 'single_choice' as const,
            },
            employment_industry: {
                answers: [
                    {
                        hide_if: [],
                        key: 'it_and_communication',
                        next_node: 'occupation',
                        value: 'Information technology, telecommunications, and digital services',
                    },
                ],
                hide_if: ['employment_status.answers.key.unemployed', 'employment_status.answers.key.pensioner'],
                question: 'Industry of Employment',
                type: 'single_choice' as const,
            },
            occupation: {
                answers: [
                    {
                        hide_if: [],
                        key: 'director',
                        next_node: 'income_source',
                        value: 'Director',
                    },
                ],
                hide_if: ['employment_status.answers.key.unemployed', 'employment_status.answers.key.pensioner'],
                question: 'Occupation',
                type: 'single_choice' as const,
            },
            income_source: {
                answers: [
                    {
                        hide_if: [],
                        key: 'salary_income',
                        next_node: 'net_income',
                        value: 'Wages, salaries and professional earnings',
                    },
                ],
                hide_if: [],
                question: 'Primary Source of Funds for Trading',
                type: 'single_choice' as const,
            },
            net_income: {
                answers: [
                    {
                        hide_if: [],
                        key: '25001-50000',
                        next_node: 'source_of_wealth',
                        value: '$25,001 - $50,000',
                    },
                ],
                hide_if: [],
                question: 'Net Annual Income',
                type: 'single_choice' as const,
            },
            estimated_worth: {
                answers: [
                    {
                        hide_if: [],
                        key: '250001-500000',
                        next_node: 'investment_intention',
                        value: '$250,001 - $500,000',
                    },
                ],
                hide_if: [],
                question: 'Estimated Net Worth',
                type: 'single_choice' as const,
            },
            investment_intention: {
                answers: [
                    {
                        hide_if: [],
                        key: '100001_250000',
                        next_node: null,
                        value: '$100,001 - $250,000',
                    },
                ],
                hide_if: [],
                question: 'How much do you intend to invest (Annual)',
                type: 'single_choice' as const,
            },
            source_of_wealth: {
                answers: [
                    {
                        hide_if: [],
                        key: 'income_savings',
                        next_node: 'estimated_worth',
                        value: 'Built-up savings or retained income',
                    },
                ],
                hide_if: [],
                question: 'Source of Wealth',
                type: 'multiple_choice' as const,
            },
        },
        version: 'v2',
    };

    const mockResponse = {
        financial_assessment_questions: mockFinancialAssessmentQuestions,
        msg_type: 'financial_assessment_questions',
        req_id: 123,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state correctly when data is null', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.data).toBe(null);
        expect(result.current.raw_data).toBe(null);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should return parsed financial assessment questions data', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: mockResponse,
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.data).toEqual(mockFinancialAssessmentQuestions);
        expect(result.current.raw_data).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should return null when financial_assessment_questions is missing in response', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: {
                msg_type: 'financial_assessment_questions',
                req_id: 123,
            },
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.data).toBe(null);
    });

    it('should pass correct payload to useQuery', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('financial_assessment_questions', {
            payload: {
                financial_assessment_questions: 1,
                version: 'v2',
            },
            options: {
                staleTime: Infinity,
            },
        });
    });

    it('should merge custom options with default options', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        const customOptions = {
            enabled: true,
            refetchOnMount: true,
        };

        renderHook(() => useFinancialAssessmentQuestions(customOptions), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('financial_assessment_questions', {
            payload: {
                financial_assessment_questions: 1,
                version: 'v2',
            },
            options: {
                staleTime: Infinity,
                ...customOptions,
            },
        });
    });

    it('should handle loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBe(null);
    });

    it('should handle error state', () => {
        const mockError = new Error('Network error');
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: mockError,
        });

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.error).toBe(mockError);
        expect(result.current.data).toBe(null);
    });

    it('should return all useQuery properties', () => {
        const mockQueryResult = {
            data: mockResponse,
            isLoading: false,
            error: null,
            refetch: jest.fn(),
            isFetching: false,
        };

        (useQuery as jest.Mock).mockReturnValue(mockQueryResult);

        const { result } = renderHook(() => useFinancialAssessmentQuestions(), { wrapper });

        expect(result.current.data).toEqual(mockFinancialAssessmentQuestions);
        expect(result.current.raw_data).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.refetch).toBe(mockQueryResult.refetch);
        expect(result.current.isFetching).toBe(false);
    });
});
