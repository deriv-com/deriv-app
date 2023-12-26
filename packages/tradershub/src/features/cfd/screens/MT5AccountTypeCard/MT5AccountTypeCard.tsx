import React, { FC, ReactNode } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';

type TProps = {
    description: string;
    icon: ReactNode;
    isSelected: boolean;
    onClick: () => void;
    title: string;
};

const MT5AccountTypeCard: FC<TProps> = ({ description, icon, isSelected, onClick, title }) => {
    return (
        <div
            className={qtMerge(
                isSelected
                    ? 'rounded-800 border-brand-blue bg-system-light-primary-background cursor-pointer border-solid border-sm'
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
                <div className='flex items-start self-stretch flex-1 border-solid rounded-lg p-1200 border-system-light-active-background bg-system-light-primary-background border-sm'>
                    <div className='flex flex-col items-center self-stretch justify-center gap-1200'>
                        {icon}
                        <div className='flex flex-col items-center self-stretch gap-400'>
                            <div className='flex items-center flex-1 text-center'>
                                <Text bold>{title}</Text>
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
