import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const Loading = ({ className, id, is_fullscreen = true, is_slow_loading, status, theme }) => {
    const theme_class = theme ? `barspinner-${theme}` : 'barspinner-light';
    return (
        <div className={classNames('initial-loader', {
            'initial-loader--fullscreen': is_fullscreen,
        }, className)}
        >
            <div
                id={id}
                className={classNames('initial-loader__barspinner', 'barspinner', theme_class)}
            >
                { Array.from(new Array(5)).map((x, inx) => (
                    <div
                        key={inx}
                        className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`}
                    />
                ))}
            </div>
            { is_slow_loading && status.map((text, inx) => (
                <h3 className='initial-loader__text' key={inx}>{text}</h3>
            ))
            }
        </div>
    );
};

Loading.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    is_slow_loading: PropTypes.bool,
    status         : PropTypes.array,
    theme          : PropTypes.string,
};
export default Loading;
