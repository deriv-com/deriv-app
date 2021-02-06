import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { positionPropType } from './utils';
import Icon from '../icon';
import Text from '../text';

const IconArrow = props => <Icon width={30} height={9} icon='IcChevronUp' {...props} />;
const IconArrowWithTitle = ({ title, ...props }) => (
    <>
        <Text size='xs' weight='bold' color='prominent' className='dc-collapsible__title'>
            {title}
        </Text>
        <Icon icon='IcChevronDown' {...props} />
    </>
);

const ArrowButton = ({ is_collapsed, position, onClick, title }) => {
    const [is_open, expand] = React.useState(!is_collapsed);

    const toggleExpand = () => {
        expand(!is_open);
        if (typeof onClick === 'function') {
            onClick();
        }
    };

    React.useEffect(() => {
        expand(is_collapsed);
    }, [is_collapsed]);

    let icon_arrow;
    switch (position) {
        case 'top':
            icon_arrow = title ? (
                <IconArrowWithTitle
                    title={title}
                    className={classNames('dc-collapsible__icon', {
                        'dc-collapsible__icon--top': true,
                        'dc-collapsible__icon--is-open': is_open,
                    })}
                />
            ) : (
                <IconArrow
                    className={classNames('dc-collapsible__icon', {
                        'dc-collapsible__icon--top': true,
                        'dc-collapsible__icon--is-open': is_open,
                    })}
                />
            );
            break;
        default:
            icon_arrow = title ? (
                <IconArrowWithTitle
                    title={title}
                    className={classNames('dc-collapsible__icon', {
                        'dc-collapsible__icon--bottom': true,
                        'dc-collapsible__icon--is-open': is_open,
                    })}
                />
            ) : (
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
    title: PropTypes.string,
    ...positionPropType,
};

export default ArrowButton;
