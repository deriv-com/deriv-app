import React     from 'react';
import PropTypes from 'prop-types';

class Icon extends React.PureComponent {
    render() {
        const options = {
            className    : this.props.className,
            customColors : this.props.customColors,
            is_disabled  : this.props.is_disabled,
            onClick      : this.props.onClick,
            onMouseEnter : this.props.onMouseEnter,
            onMouseLeave : this.props.onMouseLeave,
            theme        : this.props.theme,
        };

        const IconLazy = React.lazy(() => import(`deriv-components/lib/icons/${this.props.icon}.jsx`));
        if (!IconLazy) return <div />;

        return (
            <React.Suspense fallback={<div />}>
                <IconLazy {...options} />
            </React.Suspense>
        );
    }
}

Icon.propTypes = {
    className   : PropTypes.string,
    customColors: PropTypes.object,
    icon        : PropTypes.string,
    is_disabled : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick     : PropTypes.func,
    theme       : PropTypes.string,
};

export default Icon;
