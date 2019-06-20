import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import Icon          from 'Assets/icon.jsx';
import PopoverBubble from './popover-bubble.jsx';

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
        this.setState({
            is_open         : this.props.has_error,
            target_rectangle: this.target_reference.current.getBoundingClientRect(),
        });
    }

    toggleIsOpen = () => {
        this.setState({
            is_open         : !this.state.is_open && Boolean(this.props.message),
            target_rectangle: this.target_reference.current.getBoundingClientRect(),
        });
    }

    render() {
        const {
            alignment,
            children,
            classNameBubble,
            classNameTarget,
            classNameTargetIcon,
            has_error,
            icon,
            margin,
            message,
        } = this.props;

        const icon_class_name = classNames(classNameTargetIcon, icon);
        return (
            <div
                className='popover'
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                <div className={classNames(classNameTarget, 'popover__target')} ref={this.target_reference}>
                    <i className={message ? 'popover__target__icon' : 'popover__target__icon--disabled'}>
                        {(icon === 'info')     && <Icon icon='IconInfoOutline' className={icon_class_name} /> }
                        {(icon === 'question') && <Icon icon='IconQuestion'    className={icon_class_name} />}
                        {(icon === 'dot')      && <Icon icon='IconRedDot'      className={icon_class_name} />}
                    </i>

                    { children }
                </div>

                <PopoverBubble
                    alignment={alignment}
                    className={classNameBubble}
                    has_error={has_error}
                    icon={icon}
                    is_open={this.state.is_open}
                    target_rectangle={this.state.target_rectangle}
                    margin={margin}
                    message={message}
                />
            </div>
        );
    }
}

Popover.propTypes = {
    alignment          : PropTypes.string,
    children           : PropTypes.node,
    classNameBubble    : PropTypes.string,
    classNameTarget    : PropTypes.string,
    classNameTargetIcon: PropTypes.string,
    has_error          : PropTypes.bool,
    icon               : PropTypes.string,
    margin             : PropTypes.number,
    message            : PropTypes.string,
};

export default Popover;
