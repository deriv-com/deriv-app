import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import HighlightWrapper from './button-highlight-wrapper.jsx';
import Button           from '../button';

const ButtonToggleMenu = ({
    buttons_arr,
    className,
    id,
    is_animated,
    name,
    onChange,
    value,
}) => {
    const changeValue = (selected_value) => {
        if (value === selected_value) return;
        onChange({ target: { value: selected_value, name } });
    };
    const menu = buttons_arr.map((val, idx) => {
        const menuClassNames = classNames(
            'button-menu__button',
            {
                'button-menu__button--active': val.value === value,
            },
        );
        return (
            <Button
                id={`dc_${val.value}_toggle_item`}
                key={idx}
                text={`${val.text.charAt(0).toUpperCase()}${val.text.slice(1)}`}
                onClick={() => changeValue(val.value)}
                className={menuClassNames}
            />
        );
    });
    return (
        <div
            id={id}
            className={classNames('button-menu', className)}
        >
            {is_animated ?
                <HighlightWrapper>
                    {menu}
                </HighlightWrapper>
                :
                <React.Fragment>
                    {menu}
                </React.Fragment>
            }
        </div>
    );
};

ButtonToggleMenu.propTypes = {
    buttons_arr: PropTypes.array,
    className  : PropTypes.string,
    id         : PropTypes.string,
    is_animated: PropTypes.bool,
    name       : PropTypes.string,
    onChange   : PropTypes.func,
    value      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ButtonToggleMenu;
