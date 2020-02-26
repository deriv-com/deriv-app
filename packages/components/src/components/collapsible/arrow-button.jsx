import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { positionPropType } from './utils';
import Icon from '../icon';

const IconArrow = props => <Icon width={30} height={9} icon='IcChevronUp' {...props} />;

const ArrowButton = ({ is_collapsed, position, onClick }) => {
    const [is_open, expand] = useState(!is_collapsed);

    const toggleExpand = () => {
        expand(!is_open);
        if (typeof onClick === 'function') {
            onClick();
        }
    };

    useEffect(() => {
        expand(is_collapsed);
    }, [is_collapsed]);

    let icon_arrow;
    switch (position) {
        case 'top':
            icon_arrow = (
                <IconArrow
                    className={classNames('dc-collapsible__icon', {
                        'dc-collapsible__icon--top': true,
                        'dc-collapsible__icon--is-open': is_open,
                    })}
                />
            );
            break;
        default:
            icon_arrow = (
                <IconArrow
                    className={classNames('dc-collapsible__icon', {
                        'dc-collapsible__icon--bottom': true,
                        'dc-collapsible__icon--is-open': is_open,
                    })}
                />
            );
    }

    return (
        <div className='dc-collapsible__button' onClick={toggleExpand}>
            {icon_arrow}
        </div>
    );
};

ArrowButton.propTypes = {
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    ...positionPropType,
};

export default ArrowButton;
