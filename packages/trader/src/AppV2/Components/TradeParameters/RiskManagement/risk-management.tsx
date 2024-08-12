import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, Text, TextField, SectionMessage } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import RiskManagementPicker from './risk-management-picker';

type TRiskManagementProps = {
    is_minimized?: boolean;
};

const RiskManagement = observer(({ is_minimized }: TRiskManagementProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const { cancellation_range_list } = useTraderStore();

    const should_show_deal_cancellation = cancellation_range_list?.length > 0;
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');
    const action_sheet_content = [
        {
            id: 1,
            component: <RiskManagementPicker />,
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <React.Fragment>
                            <Text bold color='quill-typography__color--prominent'>
                                <Localize i18n_default_text='TakeProfit' />
                            </Text>
                            <Text className='risk-management__description__definition'>
                                <Localize i18n_default_text='When your profit reaches or exceeds this amount, your trade will be closed automatically.' />
                            </Text>
                            <Text bold color='quill-typography__color--prominent'>
                                <Localize i18n_default_text='Stop loss' />
                            </Text>
                            <Text className='risk-management__description__definition'>
                                <Localize i18n_default_text='When your loss reaches or exceeds this amount, your trade will be closed automatically.' />
                            </Text>
                            {should_show_deal_cancellation && (
                                <React.Fragment>
                                    <Text bold color='quill-typography__color--prominent'>
                                        <Localize i18n_default_text='Deal cancellation' />
                                    </Text>
                                    <Text className='risk-management__description__definition'>
                                        <Localize i18n_default_text='When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.' />
                                    </Text>
                                    <SectionMessage
                                        message={
                                            <Localize i18n_default_text='Take profit and/or stop loss are not available while deal cancellation is active.' />
                                        }
                                        size='sm'
                                        status='info'
                                    />
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    }
                    classname='risk-management__description'
                    is_custom_description
                />
            ),
        },
    ];
    return (
        <>
            <TextField
                className={classname}
                label={
                    <Localize
                        i18n_default_text='Risk Management'
                        key={`risk-management${is_minimized ? '-minimized' : ''}`}
                    />
                }
                onClick={() => setIsOpen(true)}
                readOnly
                value={'-'}
                variant='fill'
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => setIsOpen(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        classname={clsx('risk-management__carousel')}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Risk Management' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default RiskManagement;
