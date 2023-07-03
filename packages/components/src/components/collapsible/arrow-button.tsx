import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';
import Text from '../text';

type TIconArrowWithTitle = {
    title: string;
    className?: string;
};

type TArrowButton = {
    is_collapsed?: boolean;
    is_open?: boolean;
    onClick: () => void;
    title?: string;
    position: 'top' | 'bottom';
};

const IconArrow = ({ className }: { className?: string }) => (
    <Icon width={30} height={9} icon='IcChevronUp' className={className} />
);

const IconArrowWithTitle = ({ title, ...props }: TIconArrowWithTitle) => (
    <React.Fragment>
        <Text size='xs' weight='bold' color='prominent' className='dc-collapsible__title'>
            {title}
        </Text>
        <Icon icon='IcChevronDown' {...props} />
    </React.Fragment>
);

const ArrowButton = ({ is_collapsed = false, position, onClick, title }: TArrowButton) => {
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

export default ArrowButton;
