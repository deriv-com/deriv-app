import ErrorStore from '../error-store';

let error_store;

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

        expect(error_store.is_ask_uk_funds_protection).toBeFalse();

        error_store.setIsAskUkFundsProtection(true);

        expect(error_store.is_ask_uk_funds_protection).toBeTrue();
    });

    it('should change value of the variable is_self_exclusion_max_turnover_set', () => {
        error_store.setIsSelfExclusionMaxTurnoverSet(false);

        expect(error_store.is_self_exclusion_max_turnover_set).toBeFalse();

        error_store.setIsSelfExclusionMaxTurnoverSet(true);

        expect(error_store.is_self_exclusion_max_turnover_set).toBeTrue();
    });

    it('should change value of the variable is_ask_authentication', () => {
        error_store.setIsAskAuthentication(false);

        expect(error_store.is_ask_authentication).toBeFalse();

        error_store.setIsAskAuthentication(true);

        expect(error_store.is_ask_authentication).toBeTrue();
    });

    it('should change value of the variable is_ask_financial_risk_approval', () => {
        error_store.setIsAskFinancialRiskApproval(false);

        expect(error_store.is_ask_financial_risk_approval).toBeFalse();

        error_store.setIsAskFinancialRiskApproval(true);

        expect(error_store.is_ask_financial_risk_approval).toBeTrue();
    });

    it('should proper handle different error codes', () => {
        const spySetErrorMessage = jest.spyOn(error_store, 'setErrorMessage');

        error_store.handleCashierError({ code: 'ASK_TNC_APPROVAL' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'ASK_TNC_APPROVAL' }, null, true);

        error_store.handleCashierError({ code: 'ASK_FIX_DETAILS' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'ASK_FIX_DETAILS' }, null, true);

        error_store.handleCashierError({ code: 'ASK_UK_FUNDS_PROTECTION' });

        expect(error_store.is_ask_uk_funds_protection).toBeTrue();

        error_store.handleCashierError({ code: 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET' });

        expect(error_store.is_self_exclusion_max_turnover_set).toBeTrue();

        error_store.handleCashierError({ code: 'ASK_AUTHENTICATE' });

        expect(error_store.is_ask_authentication).toBeTrue();

        error_store.handleCashierError({ code: 'ASK_AGE_VERIFICATION' });

        expect(error_store.is_ask_authentication).toBeTrue();

        error_store.handleCashierError({ code: 'ASK_FINANCIAL_RISK_APPROVAL' });

        expect(error_store.is_ask_financial_risk_approval).toBeTrue();

        error_store.handleCashierError({ code: 'DEFAULT_ERROR_CODE' });

        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: 'DEFAULT_ERROR_CODE' });
        expect(error_store.is_ask_uk_funds_protection).toBeFalse();
        expect(error_store.is_self_exclusion_max_turnover_set).toBeFalse();
        expect(error_store.is_ask_authentication).toBeFalse();
        expect(error_store.is_ask_financial_risk_approval).toBeFalse();
    });

    it('should set proper values when the setErrorMessage function is called', () => {
        const error = {
            code: 'ERROR_CODE',
            details: { fields: 'FIELDS' },
            message: 'ERROR_MESSAGE',
        };

        const mockOnClickButton = jest.fn();

        error_store.setErrorMessage(error, mockOnClickButton, true);

        expect(error_store.onClickButton).toBe(mockOnClickButton);
        expect(error_store.code).toBe('ERROR_CODE');
        expect(error_store.message).toBe('ERROR_MESSAGE');
        expect(error_store.fields).toBe('FIELDS');
        expect(error_store.is_show_full_page).toBeTrue();
    });
});
