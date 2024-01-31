import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { TRegulatorsContentProps, TRowItem } from '../../constants/regulators-modal-content';

type TRowProps = TRegulatorsContentProps & {
    idx?: number;
};

const Row = ({ attribute, content, id, idx }: TRowProps) => (
    <tr className={qtMerge('min-h-2000', idx === 0 && 'bg-brand-pink-light')} key={id}>
        <td
            className={`sticky z-10 align-middle border-solid start-50 py-500 px-400 border-system-light-active-background border-x-75 border-b-75 ${
                idx === 0 ? 'bg-brand-pink-light' : 'bg-system-light-primary-background'
            }`}
        >
            <Text align='left' as='p' color='general' size='xs' weight='bold'>
                {attribute}
            </Text>
        </td>
        {Object.keys(content).map(rowKey => (
            <td
                className='flex-col justify-center align-middle border-solid whitespace-nowrap py-500 px-400 border-b-75 border-r-75 border-system-light-active-background'
                key={rowKey}
            >
                {Array.isArray(content[rowKey]) ? (
                    (content[rowKey] as TRowItem[])?.map(item => (
                        <Text
                            align={item?.options?.align ?? 'center'}
                            as='p'
                            color={item?.options?.color ?? 'prominent'}
                            key={`${id}_${rowKey}_${item?.text}`}
                            size='2xs'
                            weight={item?.options?.weight}
                        >
                            {item?.text}
                            {item?.options?.shouldShowAsterickAtEnd && <Text color='error'>*</Text>}
                        </Text>
                    ))
                ) : (
                    <Text
                        align={(content[rowKey] as TRowItem)?.options?.align ?? 'center'}
                        as='p'
                        color={(content[rowKey] as TRowItem)?.options?.color ?? 'prominent'}
                        size='2xs'
                        weight={(content[rowKey] as TRowItem)?.options?.weight}
                    >
                        {(content[rowKey] as TRowItem)?.text}
                    </Text>
                )}
            </td>
        ))}
    </tr>
);

export default Row;
