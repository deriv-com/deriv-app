import React, { useCallback } from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './side-note-card.scss';

type TProps = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    bullets?: React.ReactNode[];
    bullet_type?: 'dot' | 'number';
    action?: {
        onClick: VoidFunction;
        label: React.ReactNode;
    };
    hide_paddings?: boolean; // Todo: remove this prop when page layout is refactored
} & ({ title: React.ReactNode } | { description: React.ReactNode } | { bullets: React.ReactNode });

const SideNoteCard: React.FC<TProps> = observer(
    ({ title, description, bullets, bullet_type = 'dot', action, hide_paddings = false }) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const Content = useCallback(
            () => (
                <div className='side-note-card__content'>
                    {title && (
                        <Text color='prominent' weight='bold' size={is_mobile ? 'xxs' : 'xs'}>
                            {title}
                        </Text>
                    )}
                    {description && <Text size={is_mobile ? 'xxxs' : 'xxs'}>{description}</Text>}
                </div>
            ),
            [description, is_mobile, title]
        );

        const Bullets = useCallback(
            () => (
                <div className='side-note-card__bullets'>
                    {bullets?.map((bullet, index) => (
                        <div className='side-note-card__bullets--item' key={index}>
                            <Text size={is_mobile ? 'xxxs' : 'xxs'}>
                                {bullet_type === 'dot' ? '•' : `${index + 1}.`}
                            </Text>
                            <Text size={is_mobile ? 'xxxs' : 'xxs'}>{bullet}</Text>
                        </div>
                    ))}
                </div>
            ),
            [bullet_type, bullets, is_mobile]
        );

        const Action = useCallback(
            () => (
                <div className='side-note-card__action' onClick={action?.onClick}>
                    <Text size={is_mobile ? 'xxxs' : 'xxs'} color='red'>
                        {action?.label}
                    </Text>
                    <Icon icon='IcChevronRight' color='red' size={16} />
                </div>
            ),
            [action, is_mobile]
        );

        return (
            <div className='side-note-card' style={hide_paddings ? { padding: 0 } : {}}>
                {(title || description) && <Content />}
                {bullets && <Bullets />}
                {action && <Action />}
            </div>
        );
    }
);

export default SideNoteCard;
