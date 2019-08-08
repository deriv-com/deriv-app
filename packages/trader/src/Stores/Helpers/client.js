// TODO: [move-to-shared] - Remove the implementation in ClientBase and add this to shared utils
export const getClientAccountType = (loginid) => {
    let account_type;
    if (/^VR/.test(loginid))          account_type = 'virtual';
    else if (/^MF/.test(loginid))     account_type = 'financial';
    else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
    return account_type;
};

// TODO: [move-to-shared] - Remove the implementation in ClientBase and add this to shared utils
export const getMT5AccountType = group => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');
