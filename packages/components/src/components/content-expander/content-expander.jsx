import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const ContentExpander = ({
    arrow_style,
    children,
    className,
    has_fade_in,
    is_arrow_inverted,
    is_expanded,
    is_title_spaced,
    title,
    title_style,
    title_className,
    wrapper_className,
    onToggle,
    measure,
}) => {
    const [is_visible, toggleVisibility] = React.useState(is_expanded);

    const onClick = React.useCallback(() => {
        toggleVisibility(!is_visible);
        if (typeof onToggle === 'function') {
            onToggle(!is_visible);
        }
    }, [is_visible, onToggle, toggleVisibility]);

    React.useEffect(() => {
        if (typeof measure === 'function') {
            measure();
        }
    }, [is_visible]);

    return (
        <div className={classNames('dc-content-expander__wrapper', wrapper_className)}>
            <div
                className={classNames(
                    'dc-content-expander',
                    { 'dc-content-expander--expanded': is_visible },
                    className
                )}
                onClick={onClick}
            >
                <div
                    className={classNames(
                        'dc-content-expander__title',
                        {
                            'dc-content-expander__title--spaced': is_title_spaced,
                        },
                        title_className
                    )}
                >
                    {typeof title === 'string' ? (
                        <Text
                            size={title_style?.size || 's'}
                            weight={title_style?.weight || 'bold'}
                            color={title_style?.color || 'prominent'}
                            {...title_style}
                        >
                            {title}
                        </Text>
                    ) : (
                        title
                    )}
                </div>
                <Icon
                    icon='IcChevronDown'
                    className={classNames('dc-content-expander__select-arrow', {
                        'dc-content-expander__select-arrow--invert': is_arrow_inverted,
                    })}
                    {...arrow_style}
                />
            </div>
            {has_fade_in ? (
                <CSSTransition
                    in={is_visible}
                    timeout={250}
                    classNames={{
                        enter: 'dc-content-expander__content--enter',
                        enterDone: 'dc-content-expander__content--enter-done',
                        exit: 'dc-content-expander__content--exit',
                    }}
                    unmountOnExit
                >
                    <div className='dc-content-expander__content'>{children}</div>
                </CSSTransition>
            ) : (
                is_visible && <div className='dc-content-expander__content'>{children}</div>
            )}
        </div>
    );
};

ContentExpander.propTypes = {
    arrow_style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    has_fade_in: PropTypes.bool,
    is_title_spaced: PropTypes.bool,
    is_visible: PropTypes.bool,
    measure: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    title_style: PropTypes.object,
    title_className: PropTypes.string,
    wrapper_className: PropTypes.string,
    onToggle: PropTypes.func,
    toggleVisibility: PropTypes.func,
};

export default ContentExpander;
