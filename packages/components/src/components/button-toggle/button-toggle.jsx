import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import HighlightWrapper from './button-highlight-wrapper.jsx';
import Button from '../button/button.jsx';
import Counter from '../counter/counter.jsx';

const ButtonToggle = ({ buttons_arr, className, has_rounded_button, id, is_animated, name, onChange, value }) => {
    const changeValue = selected_value => {
        if (value === selected_value) return;
        onChange({ target: { value: selected_value, name } });
    };

    const menu = React.useMemo(
        () =>
            buttons_arr.map((val, idx) => {
                const menuClassNames = classNames('dc-button-menu__button', {
                    'dc-button-menu__button--active': val.value === value,
                });
                return (
                    <Button
                        id={`dc_${val.value}_toggle_item`}
                        key={idx}
                        onClick={() => changeValue(val.value)}
                        className={menuClassNames}
                        is_button_toggle
                    >
                        {`${val.text.charAt(0).toUpperCase()}${val.text.slice(1)}`}
                        {!!val.count && <Counter className='dc-button-menu__counter' count={val.count} />}
                    </Button>
                );
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [buttons_arr]
    );

    return (
        <div id={id} className={classNames('dc-button-menu', className)}>
            {is_animated ? (
                <HighlightWrapper has_rounded_button={has_rounded_button}>{menu}</HighlightWrapper>
            ) : (
                <React.Fragment>{menu}</React.Fragment>
            )}
        </div>
    );
};

ButtonToggle.propTypes = {
    buttons_arr: PropTypes.array,
    className: PropTypes.string,
    id: PropTypes.string,
    is_animated: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    has_rounded_button: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ButtonToggle;
