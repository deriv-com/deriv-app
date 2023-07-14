import React from 'react';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import './empty-state.scss';

type TAction = {
    label: string;
    onClick?: VoidFunction;
    primary?: boolean;
    tertiary?: boolean;
    disabled?: boolean;
};

export type TProps = {
    icon?: string;
    action?: TAction;
} & RequireAtLeastOne<{ title: React.ReactNode; description: React.ReactNode }>;

const EmptyState: React.FC<TProps> = ({ icon, title, description, action }) => (
    <div className='empty-state'>
        {icon && <Icon icon={icon} size={128} />}
        <br />
        {title && (
            <Text size='s' weight='bold' align='center' data-testid='dt_empty_state_title'>
                {title}
            </Text>
        )}
        {description && (
            <Text size='xs' align='center' data-testid='dt_empty_state_description'>
                {description}
            </Text>
        )}
        <br />
        {action && (
            <Button
                large
                has_effect
                text={action.label}
                onClick={action.onClick}
                primary={action.primary || true}
                tertiary={action.tertiary}
                is_disabled={action.disabled}
                data-testid='dt_empty_state_action'
            />
        )}
    </div>
);

export default EmptyState;
