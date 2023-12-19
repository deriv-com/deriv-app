import React, { FC } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';

type TProps = {
    description: string;
    icon: JSX.Element;
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
                <div className='flex items-start flex-1 p-1200 self-stretch rounded-lg border-system-light-active-background bg-system-light-primary-background border-solid border-sm'>
                    <div className='flex flex-col items-center gap-1200 self-stretch justify-center'>
                        {icon}
                        <div className='flex flex-col items-center gap-400 self-stretch'>
                            <div className='flex-1 text-center items-center flex'>
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
