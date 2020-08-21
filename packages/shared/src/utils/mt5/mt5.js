let MT5_text;

export const getMT5AccountType = group =>
    group
        ? group
              .replace('\\', '_')
              .replace(/_(\d+|master|EUR|GBP|Bbook|HighRisk)/i, '')
              // TODO: [remove-standard-advanced] remove standard and advanced when API groups are updated
              .replace(/_standard$/, '_financial')
              .replace(/_advanced$/, '_financial_stp')
        : '';

export const getMT5AccountDisplay = group => {
    if (!group) return {};

    const value = getMT5AccountType(group);
    let display_text = MT5_text.mt5;
    if (/svg$/.test(value) || /malta$/.test(value)) {
        display_text = MT5_text.synthetic;
    } else if (
        /vanuatu/.test(value) ||
        /svg_(standard|financial)/.test(value) ||
        /maltainvest_financial$/.test(value)
    ) {
        // TODO: [remove-standard-advanced] remove standard when API groups are updated
        display_text = MT5_text.financial;
    } else if (/labuan/.test(value)) {
        display_text = MT5_text.financial_stp;
    }

    return display_text;
};

export const setSharedMT5Text = all_shared_mt5_text => {
    MT5_text = all_shared_mt5_text;
};
