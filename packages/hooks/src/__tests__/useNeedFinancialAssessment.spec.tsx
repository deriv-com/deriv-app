import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen } from '@testing-library/react';
import useNeedFinancialAssessment from '../useNeedFinancialAssessment';

const UseNeedFinancialAssessmentExample = () => {
    const is_need_financial_assessment = useNeedFinancialAssessment();

    return (
        <>
            <p data-testid={'dt_is_need_financial_assessment'}>{is_need_financial_assessment ? 'true' : 'false'}</p>
        </>
    );
};

describe('useNeedFinancialAssessment', () => {
    test('should be false if is_financial_account, is_financial_information_incomplete and is_trading_experience_incomplete all are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('false');
    });

    test('should be false if is_financial_account and is_trading_experience_incomplete are false and is_financial_information_incomplete is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('false');
    });

    test('should be false if is_financial_account and is_financial_information_incomplete are false and is_trading_experience_incomplete is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: true,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('false');
    });

    test('should be false if is_financial_account is false but is_financial_information_incomplete and is_trading_experience_incomplete both are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: true,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('false');
    });

    test('should be false if is_financial_account is true but is_financial_information_incomplete and is_trading_experience_incomplete both are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('false');
    });

    test('should be true if is_financial_account and is_financial_information_incomplete are true and is_trading_experience_incomplete is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('true');
    });

    test('should be true if is_financial_account and is_trading_experience_incomplete are true and is_financial_information_incomplete is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: true,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('true');
    });

    test('should be true if is_financial_account, is_financial_information_incomplete and is_trading_experience_incomplete all are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: true,
            },
        };

        render(<UseNeedFinancialAssessmentExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_financial_assessment = screen.getByTestId('dt_is_need_financial_assessment');
        expect(is_need_financial_assessment).toHaveTextContent('true');
    });
});
