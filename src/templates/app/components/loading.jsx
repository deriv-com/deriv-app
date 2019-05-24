import React      from 'react';
import PropTypes  from 'prop-types';

const Loading = ({ status, is_slow_loading, theme, id }) => (
    <div className='initial-loader'>
        <div id={id} className={`initial-loader__barspinner barspinner barspinner-${ theme || 'light'}`}>
            { Array.from(new Array(5)).map((x, inx) => (
                <div key={inx} className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`} />
            ))}
        </div>
        { is_slow_loading &&
            <React.Fragment>
                <h3 className='initial-loader__text'>{status}</h3>
            </React.Fragment>
        }
    </div>
);

Loading.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    theme: PropTypes.string,
};
export default Loading;
