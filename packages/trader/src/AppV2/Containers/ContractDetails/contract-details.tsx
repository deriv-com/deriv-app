import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';
import PayoutInfoModal from 'AppV2/Components/PayoutInfoModal';
import ChartPlaceholder from '../Chart';
import { Localize } from '@deriv/translations';
import RiskManagementItem from 'AppV2/Components/RiskManagementItem';
import CardWrapper from 'AppV2/Components/CardWrapper';

const ContractDetails = () => {
    return (
        <div className='contract-details'>
            <div className='placeholder'>
                <Text size='sm'>Contract Details</Text>
            </div>
            <PayoutInfoModal
                body_content={
                    <Localize i18n_default_text='After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06444% from the previous spot price.' />
                }
            />
            <div className='placeholder'>
                <Text size='sm'>Contract card</Text>
            </div>
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            <CardWrapper>
                <RiskManagementItem
                    label={<Localize i18n_default_text='Deal cancellation' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                    is_deal_cancellation
                />
            </CardWrapper>
            <CardWrapper>
                <RiskManagementItem
                    label={<Localize i18n_default_text='Take profit' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                />
                <RiskManagementItem
                    label={<Localize i18n_default_text='Stop Loss' />}
                    modal_body_content={<Localize i18n_default_text='Whatever you desire' />}
                    validation_message='hello'
                />
            </CardWrapper>
            <div className='placeholder'>
                <Text size='sm'>Order details</Text>
            </div>
            <EntryExitDetails />
        </div>
    );
};

export default ContractDetails;
