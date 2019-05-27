import React     from 'react';
import PropTypes from 'prop-types';

class Icon extends React.PureComponent {
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

        return this.props.icon(options);
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
