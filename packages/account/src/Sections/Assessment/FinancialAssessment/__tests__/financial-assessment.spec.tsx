import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { ACCOUNTS_OS_DFA_URL, WS } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, waitFor } from '@testing-library/react';

import FinancialAssessment from '../financial-assessment';

const mockLocationReplace = jest.fn();

// Mock window.location.replace
Object.defineProperty(window, 'location', {
    value: {
        ...window.location,
        replace: mockLocationReplace,
        search: '',
    },
    writable: true,
});

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGrowthbookGetFeatureValue: jest.fn(),
}));

jest.mock('@deriv-com/utils', () => ({
    ...jest.requireActual('@deriv-com/utils'),
    WebSocketUtils: {
        getAppId: jest.fn(() => '12345'),
    },
    LocalStorageUtils: {
        getValue: jest.fn(() => null),
    },
    URLUtils: {
        getQueryParameter: jest.fn(() => null),
    },
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        wait: jest.fn(() => Promise.resolve()),
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        authorized: {
            storage: {
                getFinancialAssessment: jest.fn(() =>
                    Promise.resolve({
                        get_financial_assessment: {
                            account_turnover: '',
                            cfd_score: 0,
                            education_level: '',
                            employment_industry: '',
                            employment_status: 'Employed',
                            estimated_worth: '',
                            financial_information_score: '',
                            income_source: '',
                            net_income: '',
                            occupation: '',
                            source_of_wealth: '',
                            total_score: '',
                            trading_score: '',
                        },
                    })
                ),
            },
        },
    },
    useWS: () => undefined,
    getSocketURL: jest.fn(() => 'ws://localhost:443'),
    ACCOUNTS_OS_DFA_URL: 'https://test.com/Accounts/UserFinancialAssessment',
}));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});
describe('<FinancialAssessment/>', () => {
    beforeEach(() => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);
        mockLocationReplace.mockClear();
        jest.clearAllMocks();
    });

    const mock = mockStore({
        client: {
            account_settings: {
                account_opening_reason: 'Hedging',
                tax_residence: 'Germany',
                tax_identification_number: '123456789',
                employment_status: 'Employed',
            },
            getToken: jest.fn(() => 'test-token'),
        },
    });

    const renderComponent = (store_config = mock) =>
        render(
            <BrowserRouter>
                <StoreProvider store={store_config}>
                    <FinancialAssessment />
                </StoreProvider>
            </BrowserRouter>
        );

    it('should redirect to ACCOUNTS_OS_DFA_URL when component mounts', async () => {
        renderComponent();
        await waitFor(() => {
            expect(mockLocationReplace).toHaveBeenCalled();
        });
        expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_DFA_URL);
    });

    it('should redirect with correct URL parameters', async () => {
        renderComponent();
        await waitFor(() => {
            expect(mockLocationReplace).toHaveBeenCalled();
        });
        const redirectUrl = mockLocationReplace.mock.calls[0][0];
        expect(redirectUrl).toContain(ACCOUNTS_OS_DFA_URL);
        expect(redirectUrl).toContain('platform=');
        expect(redirectUrl).toContain('appid=');
        expect(redirectUrl).toContain('lang=');
        expect(redirectUrl).toContain('server=');
        expect(redirectUrl).toContain('token=');
    });

    it('should handle redirect when financial assessment data is loaded', async () => {
        WS.authorized.storage.getFinancialAssessment = jest.fn(() =>
            Promise.resolve({
                get_financial_assessment: {
                    account_turnover: '',
                    cfd_score: 0,
                    education_level: '',
                    employment_industry: '',
                    employment_status: 'Unemployed',
                    estimated_worth: '',
                    financial_information_score: '',
                    income_source: '',
                    net_income: '',
                    occupation: '',
                    source_of_wealth: '',
                    total_score: '',
                    trading_score: '',
                },
            })
        );
        renderComponent();
        await waitFor(() => {
            expect(mockLocationReplace).toHaveBeenCalled();
        });
    });
});
