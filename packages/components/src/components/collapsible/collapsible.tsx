import classNames from 'classnames';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import ArrowButton from './arrow-button';

type TCollapsible = {
    as?: React.ElementType;
    is_collapsed?: boolean;
    position?: 'top' | 'bottom';
    onClick: (state: boolean) => void;
    title?: string;
    handle_button?: boolean;
    is_non_interactive?: boolean;
};

const swipe_config = {
    delta: 10,
    trackTouch: true,
    trackMouse: true,
};

const Collapsible = ({
    as,
    is_collapsed,
    position = 'top',
    children,
    onClick,
    title,
    handle_button,
    is_non_interactive = false,
}: React.PropsWithChildren<TCollapsible>) => {
    const [is_open, expand] = React.useState(!is_collapsed);
    const [should_show_collapsible, setShouldShowCollapsible] = React.useState(false);

    const toggleExpand = () => {
        if (is_non_interactive) return;
        const new_state = !is_open;
        expand(new_state);
        if (typeof onClick === 'function') {
            onClick(new_state); // pass new state in a callback function
        }
    };

    React.useEffect(() => {
        expand(!is_collapsed);
        setShouldShowCollapsible(
            React.Children.toArray(children).some(({ props }: any) => 'data-collapsible' in props)
        );
    }, [children, is_collapsed]);

    React.useEffect(
        () =>
            setShouldShowCollapsible(
                React.Children.toArray(children).some(({ props }: any) => 'data-collapsible' in props) ||
                    is_non_interactive
            ),
        [children, is_non_interactive]
    );

    const swipe_handlers = useSwipeable({
        onSwipedUp: () => !is_open && should_show_collapsible && toggleExpand(),
        onSwipedDown: () => is_open && should_show_collapsible && toggleExpand(),
        ...swipe_config,
    });

    const arrow_button = (
        <ArrowButton
            is_collapsed={!is_open}
            position={position}
            onClick={toggleExpand}
            title={title}
            handle_button={handle_button}
            show_collapsible_button={!is_non_interactive}
        />
    );
    const CustomTag = as || 'div';
    return (
        <CustomTag
            {...swipe_handlers}
            className={classNames('dc-collapsible', {
                'dc-collapsible--is-expanded': is_open,
                'dc-collapsible--is-collapsed': !is_open,
                'dc-collapsible--has-collapsible-btn': should_show_collapsible,
                'dc-collapsible--has-title': title,
            })}
            data-testid='dt_collapsible'
        >
            {should_show_collapsible && position === 'top' && arrow_button}
            <div className='dc-collapsible__content'>
                {React.Children.map(children, element => {
                    if (React.isValidElement(element)) {
                        const collapsed_class = classNames('dc-collapsible__item', element.props.className, {
                            'dc-collapsible__item--collapsed': 'data-collapsible' in element.props && !is_open,
                        });

                        const no_collapsible_props = { ...element.props };
                        if ('data-collapsible' in no_collapsible_props) delete no_collapsible_props['data-collapsible'];

                        const props = {
                            ...no_collapsible_props,
                            className: collapsed_class,
                        };

                        return React.cloneElement(element, props);
                    }
                    return element;
                })}
            </div>
            {should_show_collapsible && position === 'bottom' && arrow_button}
        </CustomTag>
    );
};

Collapsible.displayName = 'Collapsible';
Collapsible.ArrowButton = ArrowButton;

export default Collapsible;
