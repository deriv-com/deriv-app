import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PageReturn from 'Components/page-return/page-return.jsx';
import { DesktopWrapper, Icon, MobileWrapper } from '@deriv/components';
import PropTypes from 'prop-types';

const FilterModalHeader = ({ pageHeaderReturnFn }) => {
    const { buy_sell_store } = useStores();

    if (buy_sell_store.show_filter_payment_methods) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PageReturn onClick={pageHeaderReturnFn} page_title={localize('Payment methods')} />
                </DesktopWrapper>
                <MobileWrapper>
                    <div className='filter-modal__header'>
                        <div onClick={pageHeaderReturnFn} className='filter-modal__header-return-button'>
                            <Icon icon='IcArrowLeftBold' size={16} />
                        </div>
                        <Localize i18n_default_text='Payment methods' />
                    </div>
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
