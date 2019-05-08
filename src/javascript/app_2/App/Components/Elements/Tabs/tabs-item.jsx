import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const TabsItem = ({
    active,
    children,
    elements,
    onChange,
}) => (
    React.Children.map(children, (child) => {
        const tab_class = classNames(
            'tab',
            { 'tab--active': child.key === active },
        );
        return (
            <div
                className={tab_class}
                ref={el => elements[child.key] = el}
                onClick={() => {
                    onChange(child.key);
                }}
            >
                {child}
            </div>
        );
    })
);

TabsItem.propTypes = {
    active  : PropTypes.string,
    children: PropTypes.node,
    elements: PropTypes.object,
    onChange: PropTypes.func,
};

export { TabsItem };
