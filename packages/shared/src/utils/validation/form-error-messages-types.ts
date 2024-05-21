type TMessage = () => string;
type TParameter = string | number;

export type TFormErrorMessagesTypes = Record<
    | 'empty_address'
    | 'address'
    | 'barrier'
    | 'email'
    | 'general'
    | 'name'
    | 'password'
    | 'po_box'
    | 'phone'
    | 'postcode'
    | 'signup_token'
    | 'tax_id'
    | 'number'
    | 'validTaxID',
    TMessage
> & {
    decimalPlaces: (decimals: TParameter) => string;
    value: (value: TParameter) => string;
    betweenMinMax: (min_value: TParameter, max_value: TParameter) => string;
    minNumber: (min_value: TParameter) => string;
    maxNumber: (max_value: TParameter) => string;
    password_warnings: Record<
        | 'common'
        | 'commonNames'
        | 'dates'
        | 'extendedRepeat'
        | 'keyPattern'
        | 'namesByThemselves'
        | 'pwned'
        | 'recentYears'
        | 'sequences'
        | 'similarToCommon'
        | 'simpleRepeat'
        | 'straightRow'
        | 'topHundred'
        | 'topTen'
        | 'userInputs'
        | 'wordByItself',
        TMessage
    >;
};
