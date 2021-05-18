export default class AccountLimits {
    constructor(store) {
        this.ws = store.ws;
    }
    async getStakePayoutLimits(currency = 'AUD', landing_company_shortcode = 'svg') {
        let amount_limits;
        await this.ws
            .send({
                landing_company_details: landing_company_shortcode,
            })
            .then(landing_company => {
                const commodities = landing_company.landing_company_details.currency_config.commodities;
                amount_limits = commodities[currency];
            });
        return amount_limits;
    }
}
