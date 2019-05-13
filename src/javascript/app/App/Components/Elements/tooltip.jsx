import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Icon }            from 'Assets/Common/icon.jsx';
import { IconInfoBlue }    from 'Assets/Common/icon-info-blue.jsx';
import { IconInfoOutline } from 'Assets/Common/icon-info-outline.jsx';
import { IconQuestion }    from 'Assets/Common/icon-question.jsx';
import { IconRedDot }      from 'Assets/Common/icon-red-dot.jsx';

class Tooltip extends React.PureComponent {
    state = {
        show_tooltip_balloon_icon: false,
    }

    onMouseEnter = () => {
        this.setState({ show_tooltip_balloon_icon: true });
    }

    onMouseLeave = () => {
        this.setState({ show_tooltip_balloon_icon: false });
    }

    render() {
        const {
            alignment,
            children,
            className,
            classNameIcon,
            has_error,
            icon, // only question or info accepted
            message,
        } = this.props;

        const icon_class = classNames(classNameIcon, icon);
        return (
            <span
                className={classNames(className, 'tooltip', { 'tooltip--error': has_error })}
                data-tooltip={message || undefined}
                data-tooltip-pos={alignment}
            >
                {icon === 'info' &&
                    <React.Fragment>
                        <Icon
                            icon={IconInfoOutline}
                            className={icon_class}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        />
                        <Icon
                            icon={IconInfoBlue}
                            className={classNames(`${classNameIcon}-balloon-icon`, 'tooltip__balloon-icon', {
                                'tooltip__balloon-icon--show': this.state.show_tooltip_balloon_icon,
                            })}
                        />
                    </React.Fragment>
                }
                {icon === 'question' && <Icon icon={IconQuestion} className={icon_class} />}
                {icon === 'dot'      && <Icon icon={IconRedDot} className={icon_class} />}
                {children}
            </span>
        );
    }
}

Tooltip.propTypes = {
    alignment    : PropTypes.string,
    children     : PropTypes.node,
    className    : PropTypes.string,
    classNameIcon: PropTypes.string,
    has_error    : PropTypes.bool,
    icon         : PropTypes.string,
    message      : PropTypes.string,
};

export default Tooltip;
