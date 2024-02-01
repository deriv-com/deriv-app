import React, { useRef, useState } from "react";
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useOnClickOutside } from "usehooks-ts";
import DropdownIcon from '../../public/ic-more.svg';
import './PopoverDropdown.scss';

type TItem = {
    label: string;
    value: string;
};

type TPopoverDropdownProps = {
    dropdownList: TItem[];
};

const PopoverDropdown = ({ dropdownList }: TPopoverDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const handleVisibleChange = (value: boolean) => {
        setVisible(value);
    };

    return (<div className="p2p-v2-popover-dropdown">
        <DropdownIcon onClick={() => handleVisibleChange(!visible)}  className="p2p-v2-popover-dropdown__icon"/>
        {
            visible && <div className="p2p-v2-popover-dropdown__list" ref={ref}>
                {dropdownList.map((item) => <Text className="p2p-v2-popover-dropdown__list-item">
                    {item.label}</Text>
                    )}
            </div>
        }

    </div>);
};

export default PopoverDropdown;
