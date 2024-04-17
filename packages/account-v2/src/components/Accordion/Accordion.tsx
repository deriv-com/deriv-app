import React, { PropsWithChildren, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { StandaloneChevronDownRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { accordionTransitionStyle, accordionVariant } from './Accordion.classnames';

type TAccordionProps = {
    icon: React.ReactNode;
    title: string;
};

export const Accordion = ({ children, icon, title }: PropsWithChildren<TAccordionProps>) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='flex flex-col border border-solid-grey-1 rounded-default p-24 h-fit border-solid gap-8'>
            <section className='flex justify-between gap-16 items-center'>
                {icon}
                <Text as='h2' className='flex-grow' size='sm' weight='bold'>
                    {title}
                </Text>
                <StandaloneChevronDownRegularIcon
                    className={twMerge('cursor-pointer', accordionTransitionStyle, isExpanded && 'rotate-180')}
                    iconSize='sm'
                    onClick={() => setIsExpanded(prev => !prev)}
                    role='button'
                />
            </section>
            <section
                className={twMerge(accordionTransitionStyle, accordionVariant({ expanded: isExpanded }))}
                data-testid='dt_expanded_content'
            >
                {children}
            </section>
        </div>
    );
};
