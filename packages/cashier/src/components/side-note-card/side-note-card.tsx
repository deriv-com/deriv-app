import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './side-note-card.scss';

type TProps = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: {
        onClick: VoidFunction;
        label: React.ReactNode;
    };
    hide_paddings?: boolean; // Todo: remove this prop when page layout is refactored
};

const SideNoteCard: React.FC<TProps> = observer(({ title, description, action, hide_paddings = false }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='side-note-card' style={hide_paddings ? { padding: 0 } : {}}>
            {(title || description) && (
                <div className='side-note-card__content'>
                    {title && (
                        <Text color='prominent' weight='bold' size={is_mobile ? 'xxs' : 'xs'}>
                            {title}
                        </Text>
                    )}
                    {description && <Text size={is_mobile ? 'xxxs' : 'xxs'}>{description}</Text>}
                </div>
            )}
            {action && (
                <div className='side-note-card__action' onClick={action.onClick}>
                    <Text size={is_mobile ? 'xxxs' : 'xxs'} color='red'>
                        {action.label}
                    </Text>
                    <Icon icon='IcChevronRight' color='red' size={16} />
                </div>
            )}
        </div>
    );
});

export default SideNoteCard;
