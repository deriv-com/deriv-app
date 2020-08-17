import { localize } from '@deriv/translations';

// TODO: [move-to-shared] - Remove the implementation in ClientBase and add this to shared utils
export const getClientAccountType = loginid => {
    let account_type;
    if (/^VR/.test(loginid)) account_type = 'virtual';
    else if (/^MF/.test(loginid)) account_type = 'financial';
    else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
    return account_type;
};

// TODO: [move-to-shared] - Remove the implementation in ClientBase and add this to shared utils
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
    let display_text = localize('MT5');
    if (/svg$/.test(value) || /malta$/.test(value)) {
        display_text = localize('Synthetic');
    } else if (
        /vanuatu/.test(value) ||
        /svg_(standard|financial)/.test(value) ||
        /maltainvest_financial$/.test(value)
    ) {
        // TODO: [remove-standard-advanced] remove standard when API groups are updated
        display_text = localize('Financial');
    } else if (/labuan/.test(value)) {
        display_text = localize('Financial STP');
    }

    return display_text;
};
