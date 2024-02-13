import React, { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import EditIcon from '@/assets/svgs/ic-edit.svg';
import { Clipboard, Tooltip } from '@/components';
import { ChangePassword } from '@cfd/screens';
import { Provider } from '@deriv/library';
import { Button, qtMerge, useBreakpoint } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui';

type TTradeDetailsItemProps = {
    className?: string;
    label?: string;
    value: string;
    variant?: 'clipboard' | 'info' | 'password';
};

const TradeDetailsItem = ({ className, label, value, variant = 'clipboard' }: TTradeDetailsItemProps) => {
    const { isDesktop } = useBreakpoint();
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);
    const { show } = Provider.useModal();
    return (
        <div
            className={qtMerge(
                'flex items-center h-1600 justify-between bg-system-light-secondary-background p-[5px] pl-8',
                className
            )}
        >
            {label && <Text size='sm'>{label}</Text>}
            <div className='flex items-center gap-x-8'>
                {variant === 'info' ? (
                    <Text color='less-prominent' size='sm'>
                        {value}
                    </Text>
                ) : (
                    <Text size='sm' weight='bold'>
                        {value}
                    </Text>
                )}
                {variant === 'clipboard' && <Clipboard textCopy={value} />}
                {variant === 'password' && (
                    <Tooltip alignment='left' isVisible={isHovered && isDesktop} message='Change password'>
                        <div ref={hoverRef}>
                            <Button colorStyle='white' size='sm' variant='tertiary'>
                                <EditIcon className='cursor-pointer' onClick={() => show(<ChangePassword />)} />
                            </Button>
                        </div>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default TradeDetailsItem;
