import React, { PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import { StandaloneChevronDownRegularIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
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
                <Button color='white' onClick={() => setIsExpanded(prev => !prev)} type='button' variant='ghost'>
                    <StandaloneChevronDownRegularIcon
                        className={clsx(accordionTransitionStyle, isExpanded && 'rotate-180')}
                        iconSize='sm'
                    />
                </Button>
            </section>
            <section className={accordionVariant({ expanded: isExpanded })} data-testid='dt_expanded_content'>
                <div className='overflow-hidden'>{children}</div>
            </section>
        </div>
    );
};
