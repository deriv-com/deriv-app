import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { Icon, MobileWrapper, Text } from '@deriv/components';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';

const FilterModalHeader = () => {
    const { buy_sell_store } = useStores();

    if (buy_sell_store.show_filter_payment_methods) {
        return (
            <div className='filter-modal__header'>
                <PageReturn
                    className='filter-modal__header-page-return'
                    onClick={() => buy_sell_store.setShowFilterPaymentMethods(false)}
                    page_title={localize('Payment methods')}
                />
                <MobileWrapper>
                    <div
                        onClick={() => {
                            buy_sell_store.setIsFilterModalOpen(false);
                            buy_sell_store.setShowFilterPaymentMethods(false);
                        }}
                        role='button'
                    >
                        <Icon icon='IcCross' />
                    </div>
                </MobileWrapper>
            </div>
        );
    }

    return (
        <div className='filter-modal__header'>
            <Text size='s' weight='bold'>
                <Localize i18n_default_text='Filter' />
            </Text>
            <MobileWrapper>
                <div onClick={() => buy_sell_store.setIsFilterModalOpen(false)} role='button'>
                    <Icon icon='IcCross' />
                </div>
            </MobileWrapper>
        </div>
    );
};

export default observer(FilterModalHeader);
