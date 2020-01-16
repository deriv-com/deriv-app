import classNames           from 'classnames';
import React, {
    useState,
    Children,
}                           from 'react';
import { positionPropType } from './utils';
import ArrowButton          from './arrow-button.jsx';

const Collapsible = ({
    as,
    is_collapsed,
    position = 'top',
    children,
}) => {
    const [is_open, expand] = useState(!is_collapsed);
    const toggleExpand      = () => expand(!is_open);
    const arrow_button      = <ArrowButton is_open={is_open} position={position} onClick={toggleExpand} />;
    const CustomTag         = as || 'div';
    return (
        <CustomTag className={classNames('dc-collapsible', {
            'dc-collapsible--is-expanded' : is_open,
            'dc-collapsible--is-collapsed': !is_open,
        })}
        >
            {position === 'top' && arrow_button}
            <div className='dc-collapsible__content'>
                {
                    Children.map(children, element => {
                        const collapsed_class = classNames(
                            'dc-collapsible__item',
                            element.props.className,
                            { 'dc-collapsible__item--collapsed': 'collapsible' in element.props && !is_open },
                        );

                        const no_collapsible_props = { ...element.props };
                        if ('collapsible' in no_collapsible_props) delete no_collapsible_props.collapsible;

                        const props = {
                            ...no_collapsible_props,
                            className: collapsed_class,
                        };

                        return React.cloneElement(element, props);
                    })
                }
            </div>
            {position === 'bottom' && arrow_button}
        </CustomTag>
    );
};

Collapsible.propTypes = {
    ...positionPropType,
};

Collapsible.displayName = 'Collapsible';

export default React.memo(Collapsible, ['position']);
