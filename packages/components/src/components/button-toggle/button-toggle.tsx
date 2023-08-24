import classNames from 'classnames';
import React from 'react';
import HighlightWrapper from './button-highlight-wrapper';
import Counter from '../counter/counter';
import Button from '../button/button';

type TButtonToggleProps = {
    buttons_arr: Array<{ text: string; value: number | string; count?: number }>;
    className?: string;
    id?: string;
    is_animated?: boolean;
    name: string;
    onChange: (new_values: {
        target: {
            value: string;
            name: string;
        };
    }) => void;
    has_rounded_button?: boolean;
    value: number | string;
    is_traders_hub?: boolean;
};

const ButtonToggle = ({
    buttons_arr,
    className,
    has_rounded_button = false,
    id,
    is_traders_hub = false,
    is_animated = false,
    name,
    onChange,
    value,
}: TButtonToggleProps) => {
    const changeValue = (selected_value: string) => {
        if (value === selected_value) return;
        onChange({ target: { value: selected_value, name } });
    };

    const pre_appstore_class = is_traders_hub ? '__toggle' : '__button';

    const menu = React.useMemo(
        () =>
            buttons_arr.map((val, idx) => {
                const menuClassNames = classNames(`dc-button-menu${pre_appstore_class}`, {
                    'dc-button-menu__button--active': val.value === value && !is_traders_hub,
                    'dc-button-menu__toggle--active': val.value === value && is_traders_hub,
                });
                return (
                    <Button
                        id={`dc_${val.value}_toggle_item`}
                        key={idx}
                        onClick={() => changeValue(val.value.toString())}
                        className={menuClassNames}
                        is_button_toggle
                    >
                        {`${val.text?.toString().charAt(0).toUpperCase()}${val.text?.toString().slice(1)}`}
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

export default ButtonToggle;
