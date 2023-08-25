import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import CashierBreadcrumb from '../../cashier-breadcrumb';
import { useCashierStore } from '../../../stores/useCashierStores';
import './real.scss';

const Real = observer(({ is_deposit = false }: { is_deposit?: boolean }) => {
    const { traders_hub, ui } = useStore();
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_dark_mode_on } = ui;
    const { iframe, deposit, general_store } = useCashierStore();
    const { clearIframe, iframe_height, iframe_url, checkIframeLoaded, setContainerHeight } = iframe;
    const { is_loading } = general_store;
    const { onMountDeposit } = deposit;

    const should_show_breadcrumbs = !is_low_risk_cr_eu_real && is_deposit && Boolean(iframe_height);
    const should_show_loader = is_loading || !iframe_height;

    React.useEffect(() => {
        return () => {
            clearIframe();
            onMountDeposit?.();
        };
    }, [clearIframe, onMountDeposit]);

    React.useEffect(() => {
        // To show loading state when switching theme
        setContainerHeight(0);
        checkIframeLoaded();
    }, [checkIframeLoaded, is_dark_mode_on, setContainerHeight]);

    return (
        <div className='cashier__wrapper real'>
            {should_show_loader && <Loading className='real__loader' />}
            {should_show_breadcrumbs && <CashierBreadcrumb />}
            {iframe_url && (
                <iframe
                    className='cashier__content'
                    height={iframe_height}
                    src={`${iframe_url}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}`}
                    frameBorder='0'
                    scrolling='auto'
                    data-testid='dt_doughflow_section'
                />
            )}
        </div>
    );
});

export default Real;
