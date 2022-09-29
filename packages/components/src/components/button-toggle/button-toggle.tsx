import classNames from 'classnames';
import React from 'react';
import HighlightWrapper from './button-highlight-wrapper';
import Button from '../button/button.jsx';
import Counter from '../counter/counter';

//TODO: Move the general types to types folder and file
type TGenericObjectType = {
    [key: string]: React.ReactNode;
};

type TOnChangeFuncParams = {
    target: {
        value: React.ReactNode;
        name: string;
    };
};

type TButtonToggleProps = {
    buttons_arr: TGenericObjectType[];
    className: string;
    id: string;
    is_animated: boolean;
    name: string;
    onChange: (param: TOnChangeFuncParams) => void;
    has_rounded_button: boolean;
    value: number | string;
};

const ButtonToggle = ({
    buttons_arr,
    className,
    has_rounded_button,
    id,
    is_animated,
    name,
    onChange,
    value,
}: TButtonToggleProps) => {
    const changeValue = (selected_value: React.ReactNode) => {
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
                        {`${val.text?.toString().charAt(0).toUpperCase()}${val.text?.toString().slice(1)}`}
                        {!!val.count && <Counter className='dc-button-menu__counter' count={val.count as number} />}
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
