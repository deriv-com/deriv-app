import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Icon }            from 'Assets/Common/icon.jsx';
import { IconInfoOutline } from 'Assets/Common/icon-info-outline.jsx';
import PopoverBubble       from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open         : false,
            target_rectangle: null,
        };
        this.target_reference = React.createRef();
    }

    componentDidMount() {
        this.setState({ target_rectangle: this.target_reference.current.getBoundingClientRect() });
    }

    toggleIsOpen = () => {
        this.setState({ is_open: !this.state.is_open });
        this.setState({ target_rectangle: this.target_reference.current.getBoundingClientRect() });
    }

    render() {
        const {
            alignment,
            children,
            className,
            classNameIcon,
            has_error,
            icon,
            margin,
            message,
        } = this.props;

        const icon_class = classNames(classNameIcon, icon);
        return (
            <div
                className='popover'
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                <div className='popover__target' ref={this.target_reference}>
                    { children }
                    { icon === 'info' && <Icon icon={IconInfoOutline} className={icon_class} /> }
                </div>

                <PopoverBubble
                    alignment={alignment}
                    className={className}
                    has_error={has_error}
                    icon={icon}
                    is_open={(has_error || this.state.is_open) && this.state.target_rectangle}
                    target_rectangle={this.state.target_rectangle}
                    margin={margin}
                    message={message}
                />
            </div>
        );
    }
}

Popover.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.node,
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    classNameIcon: PropTypes.string,
    has_error    : PropTypes.bool,
    icon         : PropTypes.string,
    margin       : PropTypes.number,
    message      : PropTypes.string,
};

export default Popover;
