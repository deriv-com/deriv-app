import * as React from 'react';
import classNames from 'classnames';
import Text from '../text/text.jsx';

type AppSettingsMenuItemProps = {
    is_active: boolean;
    title: string;
    refSetter: () => void;
    onClick: () => void;
};

const AppSettingsMenuItem = ({ is_active, title, refSetter, onClick }: AppSettingsMenuItemProps) => {
    const text_colour = is_active ? 'prominent' : 'less-prominent';
    const text_weight = is_active ? 'bold' : 'normal';

    return (
        <div
            onClick={onClick}
            className={classNames('dc-app-settings__menu-item', {
                'dc-app-settings__menu-item--active': is_active,
            })}
            ref={is_active ? refSetter : undefined}
        >
            <Text size='xs' line_height='m' color={text_colour} weight={text_weight}>
                {title}
            </Text>
        </div>
    );
};

export default AppSettingsMenuItem;
