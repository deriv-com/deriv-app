const Client        = require('../../base/client');
const PortfolioInit = require('../../pages/user/account/portfolio/portfolio.init');
const State         = require('../../../_common/storage').State;

const MBPortfolio = (() => {
    let $portfolio;

    let is_portfolio_active = false;

    const init = () => {
        if (Client.isLoggedIn() && isTradePage()) {
            $('#tab_portfolio').setVisibility(1);
        }

        const $container = $('#tab_portfolio-content');
        $portfolio       = $portfolio || $('#portfolio');

        if ($portfolio && (!$portfolio.parent().length || $portfolio.parent().get(0).id !== 'tab_portfolio-content')) {
            $portfolio.detach();
            $container.append($portfolio);
        }
    };

    const show = () => {
        if (isTradePage() && !is_portfolio_active) {
            PortfolioInit.onLoad();
            is_portfolio_active = true;
        }
    };

    const hide = () => {
        if (isTradePage() && is_portfolio_active) {
            PortfolioInit.onUnload();
            is_portfolio_active = false;
        }
        $portfolio = undefined;
    };

    const isTradePage = () => State.get('is_mb_trading');

    return {
        init,
        show,
        hide,
    };
})();

module.exports = MBPortfolio;
