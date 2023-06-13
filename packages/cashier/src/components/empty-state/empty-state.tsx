import React from 'react';
import { Icon, Text, Button } from '@deriv/components';
import './empty-state.scss';

type TAction = {
    label: string;
    onClick?: VoidFunction;
    primary?: boolean;
    tertiary?: boolean;
    disabled?: boolean;
};

export type TEmptyStateProps = {
    icon?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: TAction;
} & ({ title: React.ReactNode } | { description: React.ReactNode });

const EmptyState = ({ icon, title, description, action }: TEmptyStateProps) => (
    <div className='cashier-empty-state'>
        {icon && <Icon icon={icon} data_testid='dt_empty_state_icon' className='cashier-empty-state__icon' />}
        {title && (
            <Text
                as='h2'
                weight='bold'
                align='center'
                data-testid='dt_empty_state_title'
                className='cashier-empty-state__title'
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
                className='cashier-empty-state__desc'
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
                className='cashier-empty-state__action'
            />
        )}
    </div>
);

export default EmptyState;
