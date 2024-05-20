import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';
import InfoSheet from 'AppV2/Components/InfoModal';
import { localize } from '@deriv/translations';
import { LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons';
import ChartPlaceholder from '../Chart';

const ContractDetails = () => {
    return (
        <div className='contract-details'>
            <div className='placeholder'>
                <Text size='sm'>Contract Details</Text>
            </div>
            <InfoSheet
                header_content={localize('How do I earn a payout?')}
                body_content={localize(
                    'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06444% from the previous spot price.'
                )}
            />
            <div className='placeholder'>
                <Text size='sm'>Contract card</Text>
            </div>
            Take Profit
            <InfoSheet
                icon={<LabelPairedCircleInfoSmRegularIcon />}
                header_content={localize('Take profit')}
                body_content={localize(
                    'When your profit reaches or exceeds the set amount, your trade will be closed automatically.'
                )}
            />
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            <div className='placeholder'>
                <Text size='sm'>Take profit</Text>
            </div>
            <div className='placeholder'>
                <Text size='sm'>Order details</Text>
            </div>
            <EntryExitDetails />
        </div>
    );
};

export default ContractDetails;
