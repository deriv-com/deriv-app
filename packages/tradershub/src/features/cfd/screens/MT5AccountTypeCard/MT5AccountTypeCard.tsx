import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
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
        <button
            className={twMerge(
                'cursor-pointer',
                isSelected &&
                    'rounded-16 border-brand-blue bg-system-light-primary-background border-solid border-1 rounded-lg'
            )}
            onClick={onClick}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            tabIndex={0}
        >
            <div className='flex w-[264px] h-[250px] items-start'>
                <div className='flex items-start self-stretch flex-1 p-24 border-solid rounded-lg border-system-light-active-background bg-system-light-primary-background border-1'>
                    <div className='flex flex-col items-center self-stretch justify-center gap-24'>
                        {icon}
                        <div className='flex flex-col items-center self-stretch gap-8 text-center'>
                            <div className='flex items-center flex-1'>
                                <Text weight='bold'>{title}</Text>
                            </div>
                            <div className='self-stretch'>
                                <Text size='sm'>{description}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default MT5AccountTypeCard;
