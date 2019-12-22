import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React, {
    useState,
    Children,
}                 from 'react';
import Icon       from '../icon/icon.jsx';

const IconArrow = (props) => <Icon icon='IcChevronDownBold' {...props} />;

const ArrowButton = ({ position, onClick, is_open }) => {
    let icon_arrow;
    switch (position) {
        case 'top':
            icon_arrow = (
                <IconArrow className={classNames('dc-collapsible__icon', {
                    'dc-collapsible__icon--top'    : true,
                    'dc-collapsible__icon--is-open': is_open,
                })}
                />
            );
            break;
        default:
            icon_arrow = (
                <IconArrow className={classNames('dc-collapsible__icon', {
                    'dc-collapsible__icon--bottom' : true,
                    'dc-collapsible__icon--is-open': is_open,
                })}
                />
            );
    }

    return (
        <div
            className='dc-collapsible__button'
            onClick={onClick}
        >
            {icon_arrow}
        </div>
    );
};

const positionPropType = {
    position: PropTypes.oneOf([
        'top',
        'bottom',
    ]),
};

ArrowButton.propTypes = {
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    ...positionPropType,
};

const Collapsible = ({
    as,
    is_collapsed,
    position = 'top',
    children,
}) => {
    const [is_open, expand] = useState(is_collapsed && !is_collapsed);
    const toggleExpand      = () => expand(!is_open);
    const arrow_button      = <ArrowButton is_open={is_open} position={position} onClick={toggleExpand} />;
    const CustomTag         = as || 'div';
    return (
        <CustomTag className='dc-collapsible'>
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
