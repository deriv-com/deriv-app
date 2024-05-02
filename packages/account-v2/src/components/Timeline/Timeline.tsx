import React, { ComponentProps, HTMLAttributes, PropsWithChildren, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '@deriv-com/ui';

type TTimelineItemProps = HTMLAttributes<HTMLDivElement> & { itemTitle?: React.ReactNode };

type TTimelineProps = HTMLAttributes<HTMLOListElement> & {
    children: ReactElement<TTimelineItemProps> | ReactElement<TTimelineItemProps>[];
    lineHeight?: ComponentProps<typeof Text>['lineHeight'];
};

const TimelineItem = ({ children }: PropsWithChildren<TTimelineItemProps>) => {
    return <div>{children}</div>;
};

const Marker = ({ label }: { label: number }) => {
    return (
        <div className='border absolute w-24 h-24 pl-px border-solid-red-0 rounded-full bg-solid-red-0 leading-[23.5px] mr-8 text-center -left-12'>
            <Text className='relative text-white align-middle text-lg leading-normal' size='md' weight='bold'>
                {label}
            </Text>
        </div>
    );
};

/**
 * @deprecated TODO: Replace this component with the one from @deriv-com/ui is implemented.
 */
export const Timeline = ({ children, className, lineHeight }: TTimelineProps) => {
    if (!Array.isArray(children)) return null;
    return (
        <ol className={twMerge('ml-12', className)}>
            {children.map((child, idx) => {
                return (
                    <li
                        className='relative mb-0 ms-0 block w-full border-solid-red-0 border-l-1 border-solid last-of-type:border-l-0 pb-16'
                        key={idx}
                    >
                        <Marker label={idx + 1} />
                        <div className='ml-20 w-full'>
                            {child.props.itemTitle && (
                                <Text
                                    as='h2'
                                    className='max-w-[500px]'
                                    color='prominent'
                                    lineHeight={lineHeight}
                                    size='xs'
                                >
                                    {child.props.itemTitle}
                                </Text>
                            )}
                            <div className='mx-0 text-system-light-prominent-text'>{child}</div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};

Timeline.Item = TimelineItem;
