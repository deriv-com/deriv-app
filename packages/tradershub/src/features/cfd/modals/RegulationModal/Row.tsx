import React from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { TRegulatorsContentProps, TRowItem } from '../../../../constants/regulators-modal-content';

const Row = ({ attribute, content, id }: TRegulatorsContentProps) => {
    const { isMobile } = useBreakpoint();

    return (
        <tr className='regulators-compare-table__table-row' key={id}>
            <td>
                <Text align='left' as='p' color='general' size={isMobile ? '2xs' : 'xs'} weight='bold'>
                    {attribute}
                </Text>
            </td>
            {Object.keys(content).map(rowKey => (
                <td className='regulators-compare-table__table-row-item' key={rowKey}>
                    {Array.isArray(content[rowKey]) ? (
                        (content[rowKey] as TRowItem[])?.map(item => (
                            <Text
                                align={item?.options?.align ?? 'center'}
                                as='p'
                                color={item?.options?.color ?? 'prominent'}
                                key={`${id}_${rowKey}_${item?.text}`}
                                size={isMobile ? '2xs' : 'xs'}
                                weight={item?.options?.weight}
                            >
                                {item?.text}
                                {item?.options?.should_show_asterick_at_end && <Text color='error'>*</Text>}
                            </Text>
                        ))
                    ) : (
                        <Text>{(content[rowKey] as TRowItem)?.text}</Text>
                    )}
                </td>
            ))}
        </tr>
    );
};

export default Row;
