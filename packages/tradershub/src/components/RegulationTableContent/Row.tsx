import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '@deriv-com/ui';
import { TRegulatorsContentProps, TRowItem } from '../../constants/regulators-modal-content';

type TRowProps = TRegulatorsContentProps & {
    idx?: number;
};

const Row = ({ attribute, content, id, idx }: TRowProps) => (
    <tr className={twMerge('min-h-40', idx === 0 && 'bg-brand-pink-light')} key={id}>
        <td
            className={`sticky z-10 align-middle border-solid start-0 py-10 px-8 border-system-light-active-background border-x-1 border-b-1 ${
                idx === 0 ? 'bg-brand-pink-light' : 'bg-system-light-primary-background'
            }`}
        >
            <Text align='left' color='general' size='xs' weight='bold'>
                {attribute}
            </Text>
        </td>
        {Object.keys(content).map(rowKey => (
            <td
                className='justify-center px-8 py-10 align-middle border-solid border-b-1 border-r-1 border-system-light-active-background'
                key={rowKey}
            >
                <div className='flex flex-col'>
                    {Array.isArray(content[rowKey]) ? (
                        (content[rowKey] as TRowItem[])?.map(item => (
                            <Text
                                align={item?.options?.align ?? 'center'}
                                color={item?.options?.color ?? 'prominent'}
                                key={`${id}_${rowKey}_${item?.text}`}
                                size='2xs'
                                weight={item?.options?.weight}
                            >
                                {item?.text}
                                {item?.options?.shouldShowAsteriskAtEnd && <Text color='error'>*</Text>}
                            </Text>
                        ))
                    ) : (
                        <Text
                            align={(content[rowKey] as TRowItem)?.options?.align ?? 'center'}
                            color={(content[rowKey] as TRowItem)?.options?.color ?? 'prominent'}
                            size='2xs'
                            weight={(content[rowKey] as TRowItem)?.options?.weight}
                        >
                            {(content[rowKey] as TRowItem)?.text}
                        </Text>
                    )}
                </div>
            </td>
        ))}
    </tr>
);

export default Row;
