import React from 'react';
import Icon from '../icon/icon';
import Text from '../text';
import Button from '../button';
import './empty-state.scss';

type TAction = {
    label: string;
    onClick?: () => void;
    primary?: boolean;
    tertiary?: boolean;
    disabled?: boolean;
};

type TProps = {
    icon?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    action?: TAction;
} & ({ title: string | React.ReactNode } | { description: string | React.ReactNode });

const EmptyState = ({ icon, title, description, action }: TProps) => (
    <div className='components-empty-state'>
        {icon && <Icon icon={icon} data_testid='dt_empty_state_icon' className='components-empty-state__icon' />}
        {title && (
            <Text
                as='h2'
                weight='bold'
                align='center'
                data-testid='dt_empty_state_title'
                className='components-empty-state__title'
            >
                {title}
            </Text>
        )}
        {description && (
            <Text
                as='p'
                size='xs'
                align='center'
                data-testid='dt_empty_state_description'
                className='components-empty-state__desc'
            >
                {description}
            </Text>
        )}
        {action && (
            <Button
                has_effect
                text={action.label}
                onClick={action.onClick}
                primary={action.primary || true}
                tertiary={action.tertiary}
                is_disabled={action.disabled}
                large
                data-testid='dt_empty_state_action'
                className='components-empty-state__action'
            />
        )}
    </div>
);

export default EmptyState;
