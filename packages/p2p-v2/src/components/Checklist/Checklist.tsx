import React from 'react';
import { useDevice } from '@/hooks';
import { LabelPairedArrowRightLgBoldIcon, LabelPairedCheckMdBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import './Checklist.scss';

type TChecklistItem = {
    isDisabled?: boolean;
    onClick?: () => void;
    status: string;
    testId?: string;
    text: string;
};

const Checklist = ({ items }: { items: TChecklistItem[] }) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-checklist'>
            {items.map(item => (
                <div className='p2p-v2-checklist__item' key={item.text}>
                    <Text color={item.isDisabled ? 'less-prominent' : 'general'} size={isMobile ? 'md' : 'sm'}>
                        {item.text}
                    </Text>
                    {item.status === 'done' ? (
                        <div className='p2p-v2-checklist__item-checkmark'>
                            <LabelPairedCheckMdBoldIcon className='p2p-v2-checklist__item-checkmark-icon' />
                        </div>
                    ) : (
                        <Button
                            className='p2p-v2-checklist__item-button'
                            disabled={item.isDisabled}
                            icon={
                                <LabelPairedArrowRightLgBoldIcon
                                    className='p2p-v2-checklist__item-button-icon'
                                    {...(item.testId && { 'data-testid': item.testId })}
                                />
                            }
                            onClick={item.onClick}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Checklist;
