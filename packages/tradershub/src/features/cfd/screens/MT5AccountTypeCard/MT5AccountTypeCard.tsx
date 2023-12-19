import React from 'react';
import { Text } from '@deriv/quill-design';
// import './MT5AccountTypeCard.scss';

type TProps = {
    description: string;
    icon: JSX.Element;
    isSelected: boolean;
    onClick: () => void;
    title: string;
};

const MT5AccountTypeCard: React.FC<TProps> = ({ description, icon, isSelected, onClick, title }) => {
    return (
        <div
            className={
                isSelected
                    ? 'rounded-800 border-brand-blue bg-system-light-primary-background cursor-pointer'
                    : 'cursor-pointer'
            }
            onClick={onClick}
        >
            <div className='flex max-w-sm max-h-5000 items-start'>
                <div className='flex items-start flex-1 p-1200 self-stretch rounded-800 border-system-light-active-background bg-system-light-primary-background shadow-620 shadow-opacity-black-500'>
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
