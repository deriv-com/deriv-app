import React from 'react';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { InlineMessage, Table, Text, Tooltip, useDevice } from '@deriv-com/ui';
import { TAccountLimitValues } from '../../types';
import { CATEGORY } from '../../utils/accountLimitsUtils';

type TPopoverProps = {
    description: string;
};

const HintInfo = ({ description }: TPopoverProps) => (
    <InlineMessage className='bg-solid-grey-5' iconPosition='top' type='filled' variant='info'>
        <Text size='2xs'>{description}</Text>
    </InlineMessage>
);

const PopoverMessage = ({ description }: TPopoverProps) => (
    <Tooltip message={<HintInfo description={description} />} position='right'>
        <StandaloneCircleInfoRegularIcon
            className='fill-solid-grey-1'
            data-testid='dt_account_limits_table_info_icon'
            iconSize='sm'
        />
    </Tooltip>
);

const RenderRow = ({ category, hintInfo, isLessProminent, title, value }: TAccountLimitValues) => {
    const { isMobile } = useDevice();
    return (
        <div className='grid grid-flow-col justify-between'>
            <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
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
        loadMoreFunction={() => {
            //[TODO]: Add load more function
        }}
        rowRender={RenderRow}
    />
);
