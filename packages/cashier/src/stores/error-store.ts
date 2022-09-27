import { action, observable } from 'mobx';
import { getPropertyValue } from '@deriv/shared';
import { TServerError } from 'Types';

export default class ErrorStore {
    @observable message = '';
    @observable code = '';
    @observable fields = '';
    @observable is_show_full_page = false;
    @observable onClickButton: VoidFunction | null = null;
    @observable is_ask_uk_funds_protection = false;
    @observable is_self_exclusion_max_turnover_set = false;
    @observable is_ask_authentication = false;
    @observable is_ask_financial_risk_approval = false;

    @action.bound
    setErrorMessage(error: TServerError, onClickButton?: VoidFunction | null, is_show_full_page?: boolean): void {
        // for errors that need to show a button, reset the form
        const error_object = {
            onClickButton,
            code: error.code,
            message: error.message,
            is_show_full_page: is_show_full_page || /InvalidToken|WrongResponse/.test(error.code),
            ...(getPropertyValue(error, ['details', 'fields']) && {
                fields: error.details?.fields,
            }),
        };

        this.onClickButton = error_object.onClickButton;
        this.code = error_object.code;
        this.message = error_object.message;
        this.is_show_full_page = error_object.is_show_full_page;
        this.fields = error_object.fields;
        this.is_ask_uk_funds_protection = error_object?.is_ask_uk_funds_protection;
        this.is_self_exclusion_max_turnover_set = error_object?.is_self_exclusion_max_turnover_set;
        this.is_ask_authentication = error_object?.is_ask_authentication;
        this.is_ask_financial_risk_approval = error_object?.is_ask_financial_risk_approval;
    }

    @action.bound
    handleCashierError(error: TServerError): void {
        switch (error.code) {
            case 'ASK_TNC_APPROVAL':
                this.setErrorMessage(error, null, true);
                break;
            case 'ASK_FIX_DETAILS':
                this.setErrorMessage(error, null, true);
                break;
            case 'ASK_UK_FUNDS_PROTECTION':
                this.setIsAskUkFundsProtection(true);
                break;
            case 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET':
                this.setIsSelfExclusionMaxTurnoverSet(true);
                break;
            case 'ASK_AUTHENTICATE':
            case 'ASK_AGE_VERIFICATION':
                this.setIsAskAuthentication(true);
                break;
            case 'ASK_FINANCIAL_RISK_APPROVAL':
                this.setIsAskFinancialRiskApproval(true);
                break;
            default:
                this.setErrorMessage(error);
                this.setIsAskUkFundsProtection(false);
                this.setIsSelfExclusionMaxTurnoverSet(false);
                this.setIsAskAuthentication(false);
                this.setIsAskFinancialRiskApproval(false);
        }
    }

    @action.bound
    setMessage(value: string): void {
        this.message = value;
    }

    @action.bound
    setIsAskUkFundsProtection(value: boolean): void {
        this.is_ask_uk_funds_protection = value;
    }

    @action.bound
    setIsSelfExclusionMaxTurnoverSet(value: boolean): void {
        this.is_self_exclusion_max_turnover_set = value;
    }

    @action.bound
    setIsAskAuthentication(value: boolean): void {
        this.is_ask_authentication = value;
    }

    @action.bound
    setIsAskFinancialRiskApproval(value: boolean): void {
        this.is_ask_financial_risk_approval = value;
    }
}
