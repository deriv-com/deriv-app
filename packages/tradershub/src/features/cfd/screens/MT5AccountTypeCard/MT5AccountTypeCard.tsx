import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Text } from '@deriv-com/ui';

type TMT5AccountTypeCardProps = {
    description: string;
    icon: ReactNode;
    isSelected: boolean;
    onClick: () => void;
    title: string;
};

const MT5AccountTypeCard = ({ description, icon, isSelected, onClick, title }: TMT5AccountTypeCardProps) => {
    return (
        <div
            className={clsx(
                isSelected
                    ? 'rounded-16 border-brand-blue bg-system-light-primary-background cursor-pointer border-solid border-sm'
                    : 'cursor-pointer'
            )}
            onClick={onClick}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            role='button'
            tabIndex={0}
        >
            <div className='flex w-[264px] h-[250px] items-start'>
                <div className='flex items-start self-stretch flex-1 p-24 border-solid rounded-lg border-system-light-active-background bg-system-light-primary-background border-sm'>
                    <div className='flex flex-col items-center self-stretch justify-center gap-24'>
                        {icon}
                        <div className='flex flex-col items-center self-stretch gap-8'>
                            <div className='flex items-center flex-1 text-center'>
                                <Text weight='bold'>{title}</Text>
                            </div>
                            <div className='self-stretch text-center'>
                                <Text size='sm'>{description}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MT5AccountTypeCard;
