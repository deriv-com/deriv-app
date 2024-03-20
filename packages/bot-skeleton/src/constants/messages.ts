export const unrecoverable_errors = [
    'InsufficientBalance',
    'CustomLimitsReached',
    'OfferingsValidationError',
    'InvalidCurrency',
    'ContractBuyValidationError',
    'NotDefaultCurrency',
    'PleaseAuthenticate',
    'FinancialAssessmentRequired',
    'PositiveIntegerExpected',
    'OptionError',
    'IncorrectPayoutDecimals',
    'IncorrectStakeDecimals',
    'NoMFProfessionalClient',
    'AuthorizationRequired',
    'InvalidToken',
    'DailyLossLimitExceeded',
    'InputValidationFailed',
    'ClientUnwelcome',
    'PriceMoved',
];

export enum MessageTypes {
    ERROR = 'error',
    NOTIFY = 'notify',
    SUCCESS = 'success',
}

export enum ErrorTypes {
    RECOVERABLE_ERRORS = 'recoverable_errors',
    UNRECOVERABLE_ERRORS = 'unrecoverable_errors',
}

export enum LogTypes {
    LOAD_BLOCK = 'load_block',
    PURCHASE = 'purchase',
    SELL = 'sell',
    NOT_OFFERED = 'not_offered',
    PROFIT = 'profit',
    LOST = 'lost',
    WELCOME_BACK = 'welcome_back',
    WELCOME = 'welcome',
}
