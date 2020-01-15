export const client = (() => {
    const accounts     = JSON.parse(localStorage.getItem('client.accounts'));
    const login_id     = localStorage.getItem('active_loginid');
    const current_user = accounts && accounts[login_id];
    const is_logged_in = current_user || false;
    const currency     = current_user && current_user.currency;
    const token        = current_user && current_user.token;
    
    return {
        currency,
        login_id,
        is_logged_in,
        token,
    };
})();
