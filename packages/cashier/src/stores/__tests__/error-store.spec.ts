import ErrorStore from '../error-store';
import { configure } from 'mobx';

configure({ safeDescriptors: false });

let error_store: ErrorStore;

beforeEach(() => {
    error_store = new ErrorStore();
});

describe('ErrorStore', () => {
    it('should change value of the variable message', () => {
        error_store.setMessage('ERROR');

        expect(error_store.message).toBe('ERROR');
    });

    it('should change value of the variable is_ask_uk_funds_protection', () => {
        error_store.setIsAskUkFundsProtection(false);

        expect(error_store.is_ask_uk_funds_protection).toBeFalsy();

        error_store.setIsAskUkFundsProtection(true);

        expect(error_store.is_ask_uk_funds_protection).toBeTruthy();
    });

    it('should change value of the variable is_self_exclusion_max_turnover_set', () => {
        error_store.setIsSelfExclusionMaxTurnoverSet(false);

        expect(error_store.is_self_exclusion_max_turnover_set).toBeFalsy();

        error_store.setIsSelfExclusionMaxTurnoverSet(true);

        expect(error_store.is_self_exclusion_max_turnover_set).toBeTruthy();
    });

    it('should change value of the variable is_ask_authentication', () => {
        error_store.setIsAskAuthentication(false);

        expect(error_store.is_ask_authentication).toBeFalsy();

        error_store.setIsAskAuthentication(true);

        expect(error_store.is_ask_authentication).toBeTruthy();
    });

    it('should change value of the variable is_ask_financial_risk_approval', () => {
        error_store.setIsAskFinancialRiskApproval(false);

        expect(error_store.is_ask_financial_risk_approval).toBeFalsy();

        error_store.setIsAskFinancialRiskApproval(true);

        expect(error_store.is_ask_financial_risk_approval).toBeTruthy();
    });

    it('should proper handle different error codes', () => {
        const spySetErrorMessage = jest.spyOn(error_store, 'setErrorMessage');

        error_store.handleCashierError({ code: 'ASK_TNC_APPROVAL', message: '' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'ASK_TNC_APPROVAL', message: '' }, null, true);

        error_store.handleCashierError({ code: 'ASK_FIX_DETAILS', message: '' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'ASK_FIX_DETAILS', message: '' }, null, true);

        error_store.handleCashierError({ code: 'ASK_UK_FUNDS_PROTECTION', message: '' });

        expect(error_store.is_ask_uk_funds_protection).toBeTruthy();

        error_store.handleCashierError({ code: 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET', message: '' });

        expect(error_store.is_self_exclusion_max_turnover_set).toBeTruthy();

        error_store.handleCashierError({ code: 'ASK_AUTHENTICATE', message: '' });

        expect(error_store.is_ask_authentication).toBeTruthy();

        error_store.handleCashierError({ code: 'ASK_AGE_VERIFICATION', message: '' });

        expect(error_store.is_ask_authentication).toBeTruthy();

        error_store.handleCashierError({ code: 'ASK_FINANCIAL_RISK_APPROVAL', message: '' });

        expect(error_store.is_ask_financial_risk_approval).toBeTruthy();

        error_store.handleCashierError({ code: 'DEFAULT_ERROR_CODE', message: '' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'DEFAULT_ERROR_CODE', message: '' });
        expect(error_store.is_ask_uk_funds_protection).toBeFalsy();
        expect(error_store.is_self_exclusion_max_turnover_set).toBeFalsy();
        expect(error_store.is_ask_authentication).toBeFalsy();
        expect(error_store.is_ask_financial_risk_approval).toBeFalsy();
    });

    // it('should set proper values when the setErrorMessage function is called', () => {
    //     const error = {
    //         code: 'ERROR_CODE',
    //         details: { fields: 'FIELDS' },
    //         message: 'ERROR_MESSAGE',
    //     };

    //     const mockOnClickButton = jest.fn();

    //     error_store.setErrorMessage(error, mockOnClickButton, true);

    //     expect(error_store.onClickButton).toBe(mockOnClickButton);
    //     expect(error_store.code).toBe('ERROR_CODE');
    //     expect(error_store.message).toBe('ERROR_MESSAGE');
    //     expect(error_store.fields).toBe('FIELDS');
    //     expect(error_store.is_show_full_page).toBeTruthy();
    // });
});
