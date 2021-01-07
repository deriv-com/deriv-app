import classNames from 'classnames';
import React from 'react';
import Icon from '../../icon';
import Text from '../../text';

const AppCardHeader = ({ is_swap_free, onAddRealClick }) => (
    <div className='dc-app-card__header-wrapper'>
        <div className='dc-app-card__header-container'>
            <div className={classNames('dc-app-card__badge', 'dc-app-card__header-badge--demo')}>
                <Text color='general' size='xxxxs' weight='bold'>
                    Demo
                </Text>
            </div>
            {is_swap_free && (
                <div className={classNames('dc-app-card__badge', 'dc-app-card__header-badge--swap-free')}>
                    <Text color='colored-background' size='xxxxs' weight='bold'>
                        Swap Free
                    </Text>
                </div>
            )}
        </div>
        <div
            className={classNames('dc-app-card__badge', 'dc-app-card__header-badge--add-real')}
            onClick={onAddRealClick}
        >
            <Icon
                className='dc-app-card__header-badge--add-real-icon'
                icon='IcAddRounded'
                custom_color='var(--icon-dark-background)'
                size={8}
            />
            <Text
                className='dc-app-card__header-badge--add-real-text'
                color='colored-background'
                size='xxxs'
                weight='bold'
            >
                Add real
            </Text>
        </div>
    </div>
);

export default AppCardHeader;
