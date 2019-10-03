import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import PopoverBubble   from './popover-bubble.jsx';
import IconInfoOutline from '../icon-info-outline.jsx';
import IconQuestion    from '../icon-question.jsx';
import IconRedDot      from '../icon-red-dot.jsx';

class Popover extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state            = {
            is_open         : false,
            target_rectangle: null,
        };
        this.target_reference = React.createRef();
    }

    componentDidMount () {
        this.setState({
            is_open         : this.props.has_error,
            target_rectangle: this.target_reference.current.getBoundingClientRect(),
        });
    }

    toggleOpen = () => {
        this.setState({
            is_open         : Boolean(this.props.message),
            target_rectangle: this.target_reference.current.getBoundingClientRect(),
        });
    };

    toggleClose = () => this.setState({ is_open: false });

    render () {
        const {
            alignment,
            children,
            className,
            classNameBubble,
            classNameTarget,
            classNameTargetIcon,
            counter,
            disable_target_icon,
            disable_message_icon,
            has_error,
            icon,
            id,
            margin,
            message,
        } = this.props;

        const icon_class_name = classNames(classNameTargetIcon, icon);
        return (
            <div
                className={classNames('dc-popover', className)}
                id={id}
                onMouseEnter={this.toggleOpen}
                onMouseLeave={this.toggleClose}
            >
                <div className={classNames(classNameTarget, 'dc-popover__target')} ref={this.target_reference}>
                    {!disable_target_icon &&
                    <i className={message ? 'dc-popover__target__icon' : 'dc-popover__target__icon--disabled'}>
                        {(icon === 'info') && <IconInfoOutline className={icon_class_name} />}
                        {(icon === 'question') && <IconQuestion className={icon_class_name} />}
                        {(icon === 'dot') && <IconRedDot className={icon_class_name} />}
                        {(icon === 'counter') && <span className={icon_class_name}>{ counter }</span>}
                    </i>
                    }

                    {children}
                </div>

                <PopoverBubble
                    alignment={alignment}
                    className={classNameBubble}
                    has_error={has_error}
                    icon={!disable_message_icon && icon}
                    id={`${id}_bubble`}
                    is_open={this.state.is_open}
                    target_rectangle={this.state.target_rectangle}
                    margin={margin}
                    message={message}
                    portal_container={this.props.portal_container}
                />
            </div>
        );
    }
}

Popover.defaultProps = {
    portal_container: 'deriv_app',
};

Popover.propTypes = {
    alignment          : PropTypes.string,
    children           : PropTypes.node,
    className          : PropTypes.string,
    classNameBubble    : PropTypes.string,
    classNameTarget    : PropTypes.string,
    classNameTargetIcon: PropTypes.string,
    disable_target_icon: PropTypes.bool,
    has_error          : PropTypes.bool,
    icon               : PropTypes.string,
    id                 : PropTypes.string,
    margin             : PropTypes.number,
    message            : PropTypes.string,
    portal_container   : PropTypes.string,
};

export default Popover;
