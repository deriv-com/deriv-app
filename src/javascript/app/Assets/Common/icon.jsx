import React     from 'react';
import PropTypes from 'prop-types';

class Icon extends React.PureComponent {
    constructor(props) {
        super(props);
        this.icons = { /* When adding a new icon, arrange it by following the ascending file system arrangement */
            IconArrowBold         : React.lazy(() => import('./icon-arrow-bold.jsx')),
            IconArrow             : React.lazy(() => import('./icon-arrow.jsx')),
            IconBack              : React.lazy(() => import('./icon-back.jsx')),
            IconCalendarToday     : React.lazy(() => import('./icon-calendar-today.jsx')),
            IconCalendar          : React.lazy(() => import('./icon-calendar.jsx')),
            IconChevronDoubleLeft : React.lazy(() => import('./icon-chevron-double-left.jsx')),
            IconChevronDoubleRight: React.lazy(() => import('./icon-chevron-double-right.jsx')),
            IconChevronLeft       : React.lazy(() => import('./icon-chevron-left.jsx')),
            IconChevronRight      : React.lazy(() => import('./icon-chevron-right.jsx')),
            IconClear             : React.lazy(() => import('./icon-clear.jsx')),
            IconClock             : React.lazy(() => import('./icon-clock.jsx')),
            IconClose             : React.lazy(() => import('./icon-close.jsx')),
            IconCountryFlag       : React.lazy(() => import('./icon-country-flag.jsx')),
            IconError             : React.lazy(() => import('./icon-error.jsx')),
            IconExclamation       : React.lazy(() => import('./icon-exclamation.jsx')),
            IconFlag              : React.lazy(() => import('./icon-flag.jsx')),
            IconInfoBlue          : React.lazy(() => import('./icon-info-blue.jsx')),
            IconInfoOutline       : React.lazy(() => import('./icon-info-outline.jsx')),
            IconInitialLogoDark   : React.lazy(() => import('./icon-initial-logo-dark.jsx')),
            IconInitialLogoLight  : React.lazy(() => import('./icon-initial-logo-light.jsx')),
            IconMinimize          : React.lazy(() => import('./icon-minimize.jsx')),
            IconMinus             : React.lazy(() => import('./icon-minus.jsx')),
            IconPlus              : React.lazy(() => import('./icon-plus.jsx')),
            IconQuestion          : React.lazy(() => import('./icon-question.jsx')),
            IconRedDot            : React.lazy(() => import('./icon-red-dot.jsx')),
            IconSuccess           : React.lazy(() => import('./icon-success.jsx')),
            IconWarning           : React.lazy(() => import('./icon-warning.jsx')),
            IconWip               : React.lazy(() => import('./icon-wip.jsx')),
            IconSettings          : React.lazy(() => import('../Footer/icon-settings.jsx')), // Refactor this so we don't need to backtrack.
            IconMaximize          : React.lazy(() => import('../Footer/icon-maximize.jsx')), // Maybe put it in root of Assets? Also put newlines between folders so it looks nice.
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

        const IconLazy = this.icons[this.props.icon];
        if (!IconLazy) return <div />;

        return (
            <React.Suspense fallback={<div />}>
                <IconLazy {...options} />
            </React.Suspense>
        );
    }
}

Icon.propTypes = {
    category     : PropTypes.string,
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    classNameRect: PropTypes.string,
    icon         : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]),
    is_disabled: PropTypes.bool,
    onClick    : PropTypes.func,
    type       : PropTypes.string,
};

export default Icon;
