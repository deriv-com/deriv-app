import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './side-note-card.scss';

type TProps = {
    title: string;
    description: JSX.Element | string;
    hide_paddings?: boolean; // Todo: remove this prop when page layout is refactored
};

const SideNoteCard: React.FC<React.PropsWithChildren<TProps>> = observer(
    ({ title, description, hide_paddings = false, children }) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        return (
            <div className='side-note-card' style={hide_paddings ? { padding: 0 } : {}}>
                <div className='side-note-card__content'>
                    <Text color='prominent' weight='bold' size={is_mobile ? 'xxs' : 'xs'}>
                        {title}
                    </Text>
                    <Text size={is_mobile ? 'xxxs' : 'xxs'}>{description}</Text>
                </div>
                {children}
            </div>
        );
    }
);

export default SideNoteCard;
