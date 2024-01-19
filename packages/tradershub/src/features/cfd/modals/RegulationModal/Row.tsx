import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { TRegulatorsContentProps, TRowItem } from '../../../../constants/regulators-modal-content';

const Row = ({ attribute, content, id }: TRegulatorsContentProps) => (
    <tr className='regulators-compare-table__table-row min-h-2000' key={id}>
        <td className='sticky z-10 border-solid bg-system-light-primary-background inset-y-50 start-50 py-500 px-400 border-75 border-system-light-active-background'>
            <Text align='left' as='p' color='general' size='xs' weight='bold'>
                {attribute}
            </Text>
        </td>
        {Object.keys(content).map(rowKey => (
            <td
                className='flex-col justify-center border-solid whitespace-nowrap py-500 px-400 border-75 border-system-light-active-background'
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
                            {item?.options?.should_show_asterick_at_end && <Text color='error'>*</Text>}
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
