export default class AccountLimits {
    constructor(store) {
        this.ws = store.ws;
    }
    getStakePayoutLimits(currency = 'AUD', landing_company_shortcode = 'svg', selected_market) {
        console.log('selected_market', selected_market, 'currency', currency);
        return this.ws
            .send({
                landing_company_details: landing_company_shortcode,
            })
            .then(landing_company => {
                const currency_config = landing_company?.landing_company_details?.currency_config[selected_market];
                console.log('then', currency_config);
                return currency_config ? currency_config[currency] : {};
            });
    }
}
