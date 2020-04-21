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
export const getMT5AccountType = group => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');

export const getMT5AccountDisplay = group => {
    if (!group) return {};

    const value = getMT5AccountType(group);
    let display_text = localize('MT5');
    if (/svg$/.test(value)) {
        display_text = localize('Synthetic indices');
    } else if (/vanuatu/.test(value) || /svg_standard/.test(value)) {
        display_text = localize('Standard');
    } else if (/labuan/.test(value)) {
        display_text = localize('Advanced');
    }

    return display_text;
};

export const getAllMtAccounts = () => ({
    synthetic: {
        account_regex: /svg/,
        icon: 'Synthetic indices',
        title: localize('Synthetic Indices'),
        type: 'synthetic_indices',
    },
    financial: {
        account_regex: /vanuatu|svg_standard/,
        icon: 'Standard',
        title: localize('Standard'),
        type: 'standard',
    },
    financial_stp: {
        account_regex: /labuan/,
        icon: 'Advanced',
        title: localize('Advanced'),
        type: 'advanced',
    },
});
