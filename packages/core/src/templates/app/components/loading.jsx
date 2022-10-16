import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const Loading = ({ className, id, is_fullscreen = true, is_slow_loading, status, theme }) => {
    const theme_class = theme ? `barspinner-${theme}` : 'barspinner-light';
    return (
        <div
            className={classNames(
                'initial-loader',
                {
                    'initial-loader--fullscreen': is_fullscreen,
                },
                className
            )}
        >
            <div id={id} className={classNames('initial-loader__barspinner', 'barspinner', theme_class)}>
                {Array.from(new Array(5)).map((x, inx) => (
                    <div
                        key={inx}
                        className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${
                            inx + 1
                        } rect${inx + 1}`}
                    />
                ))}
            </div>
            {is_slow_loading &&
                status.map((text, inx) => (
                    <Text as='h3' size='xs' align='center' color='prominent' styles={{ lineHeight: '44px' }} key={inx}>
                        {text}
                    </Text>
                ))}
        </div>
    );
};

Loading.propTypes = {
    className: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_fullscreen: PropTypes.bool,
    is_slow_loading: PropTypes.bool,
    status: PropTypes.array,
    theme: PropTypes.string,
};
export default Loading;
