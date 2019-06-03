import React     from 'react';
import PropTypes from 'prop-types';

class Icon extends React.PureComponent {
    constructor(props) {
        super(props);
        this.icons = { /* When adding a new icon, arrange it by following the ascending file system arrangement */
            // Common
            IconArrowBold         : React.lazy(() => import('./Common/icon-arrow-bold.jsx')),
            IconArrow             : React.lazy(() => import('./Common/icon-arrow.jsx')),
            IconBack              : React.lazy(() => import('./Common/icon-back.jsx')),
            IconCalendarToday     : React.lazy(() => import('./Common/icon-calendar-today.jsx')),
            IconCalendar          : React.lazy(() => import('./Common/icon-calendar.jsx')),
            IconChevronDoubleLeft : React.lazy(() => import('./Common/icon-chevron-double-left.jsx')),
            IconChevronDoubleRight: React.lazy(() => import('./Common/icon-chevron-double-right.jsx')),
            IconChevronLeft       : React.lazy(() => import('./Common/icon-chevron-left.jsx')),
            IconChevronRight      : React.lazy(() => import('./Common/icon-chevron-right.jsx')),
            IconClear             : React.lazy(() => import('./Common/icon-clear.jsx')),
            IconClock             : React.lazy(() => import('./Common/icon-clock.jsx')),
            IconClose             : React.lazy(() => import('./Common/icon-close.jsx')),
            IconCountryFlag       : React.lazy(() => import('./Common/icon-country-flag.jsx')),
            IconDanger            : React.lazy(() => import('./Common/icon-danger.jsx')),
            IconExclamation       : React.lazy(() => import('./Common/icon-exclamation.jsx')),
            IconFlag              : React.lazy(() => import('./Common/icon-flag.jsx')),
            IconInfoBlue          : React.lazy(() => import('./Common/icon-info-blue.jsx')),
            IconInfoOutline       : React.lazy(() => import('./Common/icon-info-outline.jsx')),
            IconInformation       : React.lazy(() => import('./Common/icon-information.jsx')),
            IconMinimize          : React.lazy(() => import('./Common/icon-minimize.jsx')),
            IconMinus             : React.lazy(() => import('./Common/icon-minus.jsx')),
            IconPlus              : React.lazy(() => import('./Common/icon-plus.jsx')),
            IconQuestion          : React.lazy(() => import('./Common/icon-question.jsx')),
            IconRedDot            : React.lazy(() => import('./Common/icon-red-dot.jsx')),
            IconSuccess           : React.lazy(() => import('./Common/icon-success.jsx')),
            IconWarning           : React.lazy(() => import('./Common/icon-warning.jsx')),
            IconWip               : React.lazy(() => import('./Common/icon-wip.jsx')),
            
            // Contract
            IconContractClose: React.lazy(() => import('./Contract/icon-contract-close.jsx')),
            IconEndTimeSVG   : React.lazy(() => import('./Contract/icon-end-time.jsx')),
            IconFlagSVG      : React.lazy(() => import('./Contract/icon-flag.jsx')),
            IconStartTimeSVG : React.lazy(() => import('./Contract/icon-start-time.jsx')),
            IconTickSVG      : React.lazy(() => import('./Contract/icon-tick.jsx')),

            // Footer
            IconMaximize : React.lazy(() => import('./Footer/icon-maximize.jsx')),
            IconPositions: React.lazy(() => import('./Footer/icon-positions.jsx')),
            IconSettings : React.lazy(() => import('./Footer/icon-settings.jsx')),

            // Header
            IconAccountsCurrency: React.lazy(() => import('./Header/AccountsCurrency')),
            IconLogout          : React.lazy(() => import('./Header/Drawer')),
            IconBell            : React.lazy(() => import('./Header/NavBar')),
            IconCashier         : React.lazy(() => import('./Header/NavBar')),
            IconDeriv           : React.lazy(() => import('./Header/NavBar')),
            IconHamburger       : React.lazy(() => import('./Header/NavBar')),
            IconPortfolio       : React.lazy(() => import('./Header/NavBar')),
            IconReports         : React.lazy(() => import('./Header/NavBar')),
            IconTrade           : React.lazy(() => import('./Header/NavBar')),

            // Reports
            IconOpenPositions: React.lazy(() => import('./Reports/icon-open-positions.jsx')),
            IconProfitTable  : React.lazy(() => import('./Reports/icon-profit-table.jsx')),
            IconStatement    : React.lazy(() => import('./Reports/icon-statement.jsx')),

            // Settings
            IconCharts       : React.lazy(() => import('./Settings')),
            IconCloseSettings: React.lazy(() => import('./Settings')), // Previously IconClose, so replace IconClose that has the same import path with this.
            IconLanguage     : React.lazy(() => import('./Settings')),
            IconPurchase     : React.lazy(() => import('./Settings')),
            IconTheme        : React.lazy(() => import('./Settings')),

            // Statement
            IconBuy       : React.lazy(() => import('./Statement')),
            IconDeposit   : React.lazy(() => import('./Statement')),
            IconPayout    : React.lazy(() => import('./Statement')),
            IconSell      : React.lazy(() => import('./Statement')),
            IconWallet    : React.lazy(() => import('./Statement')),
            IconWithdrawal: React.lazy(() => import('./Statement')),

            // Trading
            IconBarrierDown   : React.lazy(() => import('./Trading/Barriers')),
            IconBarrierUp     : React.lazy(() => import('./Trading/Barriers')),
            IconTradeCategory : React.lazy(() => import('./Trading/Categories')),
            TradeCategoriesGIF: React.lazy(() => import('./Trading/Categories')),
            TradeCategories   : React.lazy(() => import('./Trading/Categories')),
            IconTradeType     : React.lazy(() => import('./Trading/Types')),
            IconLock          : React.lazy(() => import('./Trading/icon-lock.jsx')),
            IconPriceMove     : React.lazy(() => import('./Trading/icon-price-move.jsx')),
        };
    }

    render() {
        const options = {
            category     : this.props.category,
            className    : this.props.className,
            classNamePath: this.props.classNamePath,
            classNameRect: this.props.classNameRect,
            is_disabled  : this.props.is_disabled,
            onClick      : this.props.onClick,
            onMouseEnter : this.props.onMouseEnter,
            onMouseLeave : this.props.onMouseLeave,
            type         : this.props.type,
        };

        const IconLazy = this.icons[this.props.icon] ? this.icons[this.props.icon] : <div />;
        return <IconLazy {...options} />;
    }
}

Icon.propTypes = {
    category     : PropTypes.string,
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    classNameRect: PropTypes.string,
    icon         : PropTypes.func,
    is_disabled  : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick      : PropTypes.func,
    type         : PropTypes.string,
};

export { Icon };
