import classNames                       from 'classnames';
import PropTypes                        from 'prop-types';
import React                            from 'react';
import { getDisplayText, listPropType } from './dropdown';

const DisplayText = ({
    className,
    has_symbol,
    list,
    is_align_text_left,
    placeholder,
    name,
    value,
}) => {
    const symbol_value_class = value && has_symbol ? `symbols--${value.toLowerCase()}` : null;
    return (
        <React.Fragment>
            {has_symbol ?
                <span
                    className={classNames(
                        'symbols dc-dropdown__display-symbol',
                        symbol_value_class,
                        className,
                    )}
                    name={name}
                    value={value}
                />
                :
                <span
                    className={classNames('dc-dropdown__display-text', className)}
                    name={name}
                    value={value}
                >
                    {getDisplayText(list, value)}
                </span>
            }
            {placeholder &&
                <div
                    className={classNames('dc-dropdown__display-placeholder', {
                        'dc-dropdown__display-placeholder--is-title'    : value,
                        'dc-dropdown__display-placeholder--is-left-text': is_align_text_left,
                    })}
                >
                    <span className='dc-dropdown__display-placeholder-text'>
                        {placeholder}
                    </span>
                </div>
            }
        </React.Fragment>
    );
};

DisplayText.propTypes = {
    className  : PropTypes.string,
    has_symbol : PropTypes.bool,
    is_title   : PropTypes.bool,
    list       : listPropType(),
    name       : PropTypes.string,
    placeholder: PropTypes.string,
    value      : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default DisplayText;
