import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import RealAccountSignup from '../real-account-signup.jsx';
import { Analytics } from '@deriv/analytics';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: () => <div>RealAccountModalContent</div>,
    DesktopWrapper: jest.fn(({ children }) => (
        <div>
            <div>{children}</div>
        </div>
    )),
    MobileWrapper: jest.fn(({ children }) => (
        <div>
            <div>{children}</div>
        </div>
    )),
}));

jest.mock('@deriv/account', () => {
    const original_module = jest.requireActual('@deriv/account');
    return {
        ...original_module,
        TestWarningModal: () => <div>TestWarningModal</div>,
    };
});

jest.mock('../account-wizard.jsx', () => ({
    __esModule: true,
    default: () => <div>Account Wizard</div>,
}));

describe('<RealAccountSignup />', () => {
    const mock_props = {
        available_crypto_currencies: [],
        closeRealAccountSignup: jest.fn(),
        country_standpoint: '',
        currency: 'USD',
        deposit_real_account_signup_target: 'mf',
        deposit_target: '',
        redirectToLegacyPlatform: jest.fn(),
        fetchAccountSettings: jest.fn(),
        fetchFinancialAssessment: jest.fn(),
        has_fiat: false,
        has_real_account: false,
        is_belgium_residence: false,
        is_from_restricted_country: false,
        is_isle_of_man_residence: false,
        is_real_acc_signup_on: true,
        real_account_signup_target: 'maltainvest',
        realAccountSignup: jest.fn(),
        setCFDScore: jest.fn(),
        setIsDeposit: jest.fn(),
        setIsTradingAssessmentForNewUserEnabled: jest.fn(),
        setIsClosingCreateRealAccountModal: jest.fn(),
        setParams: jest.fn(),
        setShouldShowAppropriatenessWarningModal: jest.fn(),
        setShouldShowRiskWarningModal: jest.fn(),
        setShouldShowVerifiedAccount: jest.fn(),
        should_show_all_available_currencies: true,
        should_show_appropriateness_warning_modal: false,
        should_show_risk_warning_modal: false,
        state_value: {
            active_modal_index: -1,
            previous_currency: '',
            current_currency: '',
            success_message: '',
            error_message: '',
        },
        show_eu_related_content: true,
        is_trading_assessment_for_new_user_enabled: false,
    };

    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('should render RealAccountSignupModal if is_real_account_signup is true', () => {
        renderwithRouter(<RealAccountSignup {...mock_props} />);
        expect(screen.getByText('RealAccountModalContent')).toBeInTheDocument();
    });

    it('should call Analytics.trackEvent on mount if real account signup target is not maltainvest', () => {
        renderwithRouter(<RealAccountSignup {...mock_props} real_account_signup_target='svg' />);
        expect(Analytics.trackEvent).toHaveBeenCalled();
    });

    it('should render TestWarningModal if should_show_appropriateness_warning_modal is set to true', () => {
        renderwithRouter(<RealAccountSignup {...mock_props} should_show_appropriateness_warning_modal />);
        expect(screen.getByText('TestWarningModal')).toBeInTheDocument();
        expect(screen.queryByText('RealAccountModalContent')).not.toBeInTheDocument();
    });
});
