import classNames from 'classnames';
import React from 'react';
import Text from '../text/text';
import Icon from '../icon/icon';

type TSubMenuSection = React.PropsWithChildren<{
    submenu_toggle_class?: string;
    section_title?: string | React.ReactElement;
    section_icon?: string;
}>;
const SubMenuSection = ({ submenu_toggle_class, section_title, section_icon, children, ...props }: TSubMenuSection) => {
    return (
        <div className={classNames('dc-mobile-drawer__submenu-section', submenu_toggle_class)}>
            <div className='dc-mobile-drawer__submenu-section-title'>
                {section_icon && <Icon className='dc-mobile-drawer__submenu-section-title-icon' icon={section_icon} />}
                {section_title && (
                    <Text as='h3' size='xs' weight='bold' className='dc-mobile-drawer__submenu-section-title-text'>
                        {section_title}
                    </Text>
                )}
            </div>
            <div className='dc-mobile-drawer__submenu-section-content'>{children}</div>
        </div>
    );
};

export default React.memo(SubMenuSection);
