let MT5_text_translated;

const MT5_text = {
    mt5: 'MT5',
    synthetic: 'Synthetic',
    financial: 'Financial',
    financial_stp: 'Financial STP',
};

export const getMT5AccountType = group =>
    group
        ? group
              .replace('\\', '_')
              .replace(/_(\d+|master|EUR|GBP|Bbook|HighRisk)/i, '')
              // TODO: [remove-standard-advanced] remove standard and advanced when API groups are updated
              .replace(/_standard$/, '_financial')
              .replace(/_advanced$/, '_financial_stp')
        : '';

const getMT5AccountKey = group => {
    if (!group) return '';

    const value = getMT5AccountType(group);
    let key = 'mt5';
    if (/svg$/.test(value) || /malta$/.test(value)) {
        key = 'synthetic';
    } else if (
        /vanuatu/.test(value) ||
        /svg_(standard|financial)/.test(value) ||
        /maltainvest_financial$/.test(value)
    ) {
        // TODO: [remove-standard-advanced] remove standard when API groups are updated
        key = 'financial';
    } else if (/labuan/.test(value)) {
        key = 'financial_stp';
    }
    return key;
};

export const getMT5AccountDisplay = group => {
    const mt5_account_key = getMT5AccountKey(group);
    if (!mt5_account_key) return '';

    return MT5_text_translated[mt5_account_key]();
};

export const getMT5Account = group => {
    const mt5_account_key = getMT5AccountKey(group);
    if (!mt5_account_key) return '';

    return MT5_text[mt5_account_key];
};

export const setSharedMT5Text = all_shared_mt5_text => {
    MT5_text_translated = all_shared_mt5_text;
};
