import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import Text from '../text/text';

const AppSettingsMenuItem = ({ is_active, title, refSetter, onClick }) => {
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

AppSettingsMenuItem.propTypes = {
    is_active: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    refSetter: PropTypes.func.isRequired,
    onClick: PropTypes.func,
};

export default AppSettingsMenuItem;
