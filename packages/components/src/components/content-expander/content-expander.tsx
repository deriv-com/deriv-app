import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Text from '../text/text';
import Icon from '../icon/icon';

type TContentExpander = {
    className?: string;
    has_fade_in?: boolean;
    is_arrow_inverted?: boolean;
    is_expanded: boolean;
    is_title_spaced?: boolean;
    title: string | React.ReactNode;
    measure?: () => void;
    title_style?: { size?: string; weight?: string; color?: string };
    title_className?: string;
    wrapper_className?: string;
    onToggle?: () => void;
};

const ContentExpander = ({
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
}: React.PropsWithChildren<TContentExpander>) => {
    const [is_visible, toggleVisibility] = React.useState<boolean>(is_expanded);

    const onClick = React.useCallback(() => {
        toggleVisibility(!is_visible);
        if (onToggle) {
            onToggle();
        }
    }, [is_visible, onToggle, toggleVisibility]);

    React.useEffect(() => {
        if (measure) {
            measure();
        }
    }, [is_visible, measure]);

    // is_visible value should come from parent bcause the parent keeps track
    // of whether we need to expand or not
    React.useEffect(() => {
        toggleVisibility(is_expanded);
    }, [is_expanded]);

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

export default ContentExpander;
