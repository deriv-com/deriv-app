import React from 'react';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { InlineMessage, Table, Text, Tooltip, useDevice } from '@deriv-com/ui';
import { CATEGORY, TAccountLimitValues } from '../../utils/accountLimitsUtils';

type TPopoverProps = {
    description: string;
};

const HintInfo = ({ description }: TPopoverProps) => (
    <InlineMessage className='bg-solid-grey-5' iconPosition='top' type='filled' variant='info'>
        <Text size='2xs'>{description}</Text>
    </InlineMessage>
);

const PopoverMessage = ({ description }: TPopoverProps) => (
    <Tooltip message={<HintInfo description={description} />} position='right' triggerAction='click'>
        <StandaloneCircleInfoRegularIcon className='fill-solid-grey-1' iconSize='sm' />
    </Tooltip>
);

const RenderRow = ({ row }: { row: TAccountLimitValues }) => {
    const { isMobile } = useDevice();
    const { category, hintInfo, isLessProminent, title, value } = row;

    return (
        <div className='grid grid-flow-col justify-between'>
            <div className='flex gap-8 sm:flex-col sm:gap-4'>
                {title && (
                    <Text
                        className={category === CATEGORY.submarket ? 'px-16' : ''}
                        color={isLessProminent ? 'less-prominent' : 'general'}
                        size={category === CATEGORY.footer ? '2xs' : 'xs'}
                        weight={category === CATEGORY.header ? 'bold' : ''}
                    >
                        {title}
                    </Text>
                )}
                {hintInfo &&
                    (isMobile ? (
                        <Text as='div' color='less-prominent' line_height='s' size='xs'>
                            {hintInfo}
                        </Text>
                    ) : (
                        <PopoverMessage description={hintInfo} />
                    ))}
            </div>
            {value && (
                <Text size='sm' weight={category === CATEGORY.header ? 'bold' : ''}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export const AccountLimitsTable = ({ accountLimitValues }: { accountLimitValues: TAccountLimitValues[] }) => (
    <Table
        data={accountLimitValues}
        isFetching={false}
        loadMoreFunction={() => {
            //[TODO]: Add load more function
        }}
        rowRender={rowData => <RenderRow row={rowData} />}
    />
);
