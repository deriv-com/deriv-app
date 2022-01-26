import classNames from 'classnames';
import React from 'react';
import Text from '../../text';
import Icon from '../../icon';

type AppCardActionItemProps = {
    icon: string;
    is_hovered: boolean;
    is_virtual: boolean;
    label: string;
    onClickHandler: () => void;
};

const AppCardActionItem = React.forwardRef(
    ({ icon, is_hovered, is_virtual, label, onClickHandler }: AppCardActionItemProps, ref) => (
        <div className='dc-app-card-actions__content-wrapper' onClick={onClickHandler} ref={ref}>
            <Icon
                icon={icon}
                className={classNames('dc-app-card-actions__icon', {
                    'dc-app-card-actions__icon--hover': is_hovered,
                    'dc-app-card-actions__icon--hover-virtual': is_hovered && is_virtual,
                    'dc-app-card-actions__icon--hover-real': is_hovered && !is_virtual,
                })}
                custom_color={is_virtual ? 'var(--icon-dark-background)' : 'var(--icon-light-background)'}
            />
            {is_hovered && (
                <Text size='xxxxs' color={is_virtual ? 'colored-background' : 'general'}>
                    {label}
                </Text>
            )}
        </div>
    )
);

AppCardActionItem.displayName = 'AppCardActionItem';

export default AppCardActionItem;
