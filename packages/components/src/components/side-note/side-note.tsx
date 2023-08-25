import React from 'react';
import { isMobile } from '@deriv/shared';
import Icon from '../icon/icon';
import Text from '../text';
import './side-note.scss';

type TProps = {
    action?: { onClick: VoidFunction; label: React.ReactNode };
} & RequireAtLeastOne<{ title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }>;

const SideNote: React.FC<React.PropsWithChildren<TProps>> = ({ title, description, action, children }) => {
    const title_font_size = isMobile() ? 'xxs' : 'xs';
    const content_font_size = isMobile() ? 'xxxs' : 'xxs';

    return (
        <div className='side-note'>
            <div className='side-note__content'>
                {title && (
                    <Text weight='bold' size={title_font_size}>
                        {title}
                    </Text>
                )}
                {(description || children) && (
                    <Text size={content_font_size}>
                        {description && <span>{description}</span>}
                        {children}
                    </Text>
                )}
            </div>
            {action && (
                <div className='side-note__action' onClick={action?.onClick}>
                    <Text size={content_font_size} color='red'>
                        {action?.label}
                    </Text>
                    <Icon icon='IcChevronRight' color='red' size={16} />
                </div>
            )}
        </div>
    );
};

export default SideNote;
