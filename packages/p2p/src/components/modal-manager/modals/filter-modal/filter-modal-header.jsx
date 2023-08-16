import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import PropTypes from 'prop-types';

const FilterModalHeader = ({ pageHeaderReturnFn }) => {
    const { buy_sell_store } = useStores();

    if (buy_sell_store.show_filter_payment_methods) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PageReturn
                        className='filter-modal__header'
                        onClick={pageHeaderReturnFn}
                        page_title={localize('Payment methods')}
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <Text align='center' weight='bold'>
                        <Icon
                            className='filter-modal__header-return-button'
                            icon='IcArrowLeftBold'
                            onClick={pageHeaderReturnFn}
                            size={16}
                        />
                        <Localize i18n_default_text='Payment methods' />
                    </Text>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return <Localize i18n_default_text='Filter' />;
};

FilterModalHeader.propTypes = {
    pageHeaderReturnFn: PropTypes.func,
};

export default observer(FilterModalHeader);
