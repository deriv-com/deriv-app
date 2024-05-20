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
    /*
        common: 'This is a very common password.',
        commonNames: 'Common names and surnames are easy to guess.',
        dates: 'Dates are easy to guess.',
        extendedRepeat: 'Repeated character patterns like "abcabcabc" are easy to guess.',
        keyPattern: 'Short keyboard patterns are easy to guess.',
        namesByThemselves: 'Single names or surnames are easy to guess.',
        pwned: 'Your password was exposed by a data breach on the Internet.',
        recentYears: 'Recent years are easy to guess.',
        sequences: 'Common character sequences like "abc" are easy to guess.',
        similarToCommon: 'This is similar to a commonly used password.',
        simpleRepeat: 'Repeated characters like "aaa" are easy to guess.',
        straightRow: 'Straight rows of keys on your keyboard are easy to guess.',
        topHundred: 'This is a frequently used password.',
        topTen: 'This is a heavily used password.',
        userInputs: 'There should not be any personal or page related data.',
        wordByItself: 'Single words are easy to guess.',
    */
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
