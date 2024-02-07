import React, { useRef, useState } from 'react';
import { Button, Text } from '@deriv-com/ui';
import { useOnClickOutside } from 'usehooks-ts';
import { LabelPairedEllipsisVerticalMdRegularIcon } from '@deriv/quill-icons';
import './PopoverDropdown.scss';

type TItem = {
    label: string;
    value: string;
};

type TPopoverDropdownProps = {
    dataTestId?: string;
    dropdownList: TItem[];
    onClick: (value: string) => void;
};

const PopoverDropdown = ({ dataTestId, dropdownList, onClick }: TPopoverDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));

    return (
        <div className='p2p-v2-popover-dropdown' ref={ref}>
            <LabelPairedEllipsisVerticalMdRegularIcon
                className='p2p-v2-popover-dropdown__icon'
                data-testid={dataTestId}
                onClick={() => setVisible(prevState => !prevState)}
            />
            {visible && (
                <div className='p2p-v2-popover-dropdown__list'>
                    {dropdownList.map(item => (
                        <Button
                            className='p2p-v2-popover-dropdown__list-item'
                            key={item.value}
                            onClick={() => {
                                onClick(item.value);
                                setVisible(false);
                            }}
                        >
                            <Text key={item.value}>{item.label}</Text>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopoverDropdown;
