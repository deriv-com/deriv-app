import React from 'react';
import { BUY_SELL } from '@/constants';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TBuySellFormHeaderProps = {
    currency: string | undefined;
    onClickBack?: () => void;
    type: string | undefined;
};
const BuySellFormHeader = ({ currency = '', onClickBack, type = '' }: TBuySellFormHeaderProps) => (
    <div className='px-[2.4rem] py-[1.6rem] gap-6 flex items-center'>
        {onClickBack && (
            <LabelPairedArrowLeftLgBoldIcon data-testid='dt_p2p_v2_buy_sell_form_header_back' onClick={onClickBack} />
        )}
        <Text size='lg' weight='bold'>
            {`${type === BUY_SELL.BUY ? 'Sell' : 'Buy'} ${currency}`}
        </Text>
    </div>
);

export default BuySellFormHeader;
