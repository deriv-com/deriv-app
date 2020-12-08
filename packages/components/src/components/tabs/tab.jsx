import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Counter from '../counter';

const Tab = ({
    active_tab_ref,
    bottom,
    count,
    header_content,
    header_fit_content,
    id,
    is_active,
    is_label_hidden,
    label,
    onClick,
    setActiveLineStyle,
    top,
}) => {
    React.useEffect(() => {
        setActiveLineStyle();
    }, [count, label, header_content]);

    const classes = classNames('dc-tabs__item', {
        'dc-tabs__active': is_active,
        'dc-tabs__item--top': top,
        'dc-tabs__item--bottom': bottom,
        'dc-tabs__item--header-fit-content': header_fit_content,
        'dc-tabs__item--is-hidden': is_label_hidden,
    });
    return (
        <li id={id} className={classes} onClick={onClick} ref={active_tab_ref}>
            {header_content || label}
            {!!count && <Counter className='dc-tabs__item__counter' count={count} />}
        </li>
    );
};

Tab.propTypes = {
    active_tab_ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    bottom: PropTypes.bool,
    className: PropTypes.string,
    count: PropTypes.number,
    header_content: PropTypes.object,
    header_fit_content: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_active: PropTypes.bool,
    is_label_hidden: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    setActiveLineStyle: PropTypes.func,
    top: PropTypes.bool,
};

export default Tab;
