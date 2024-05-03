import React, { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { LabelPairedEllipsisVerticalMdRegularIcon } from '@deriv/quill-icons';
import { Button, Text, Tooltip, useDevice } from '@deriv-com/ui';
import './PopoverDropdown.scss';

type TItem = {
    label: string;
    value: string;
};

type TPopoverDropdownProps = {
    dropdownList: TItem[];
    onClick: (value: string) => void;
    tooltipMessage: string;
};

const PopoverDropdown = ({ dropdownList, onClick, tooltipMessage }: TPopoverDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-popover-dropdown' ref={ref}>
            <Tooltip message={tooltipMessage} position='bottom' triggerAction='hover'>
                <LabelPairedEllipsisVerticalMdRegularIcon
                    className='p2p-v2-popover-dropdown__icon'
                    data-testid='dt_p2p_v2_popover_dropdown_icon'
                    onClick={() => setVisible(prevState => !prevState)}
                />
            </Tooltip>
            {visible && (
                <div className='p2p-v2-popover-dropdown__list'>
                    {dropdownList.map(item => (
                        <Button
                            className='p2p-v2-popover-dropdown__list-item'
                            color='black'
                            key={item.value}
                            onClick={() => {
                                onClick(item.value);
                                setVisible(false);
                            }}
                            variant='ghost'
                        >
                            <Text
                                className='p2p-v2-popover-dropdown__list-item__label'
                                key={item.value}
                                size={isMobile ? 'md' : 'sm'}
                            >
                                {item.label}
                            </Text>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopoverDropdown;
