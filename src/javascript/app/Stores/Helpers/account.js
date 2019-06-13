const map_names = {
    country             : 'residence',
    landing_company_name: 'landing_company_shortcode',
};

export const storeClientAccounts = (obj_params, account_list) => {
    const client_object = {};
    let active_loginid;
    let is_allowed_real = true;
    // const is_allowed = account_list.some((account) => (/^virtual|svg$/.test(account.landing_company_name)));

    account_list.forEach((account) => {
        if (!/^virtual|svg$/.test(account.landing_company_name)) {
            is_allowed_real = false;
        }
    });

    account_list.forEach((account) => {
        Object.keys(account).forEach((param) => {
            if (param === 'loginid') {
                if (!active_loginid && !account.is_disabled) {
                    if (is_allowed_real) {
                        active_loginid = account[param];
                    } else if (account.is_virtual) { // TODO: [only_virtual] remove this to stop logging non-SVG clients into virtual
                        active_loginid = account[param];
                    }
                }
            } else {
                const param_to_set = map_names[param] || param;
                const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                if (!(account.loginid in client_object)) {
                    client_object[account.loginid] = {};
                }
                client_object[account.loginid][param_to_set] = value_to_set;
            }
        });
    });

    let i = 1;
    while (obj_params[`acct${i}`]) {
        const loginid = obj_params[`acct${i}`];
        const token   = obj_params[`token${i}`];
        if (loginid && token) {
            client_object[loginid].token = token;
        }
        i++;
    }

    // if didn't find any login ID that matched the above condition
    // or the selected one doesn't have a token, set the first one
    if (!active_loginid || !client_object[active_loginid].token) {
        active_loginid = obj_params.acct1;
    }

    // TODO: send login flag to GTM if needed
    if (active_loginid && Object.keys(client_object).length) {
        localStorage.setItem('active_loginid', active_loginid);
        localStorage.setItem('client.accounts', JSON.stringify(client_object));
    }
};
