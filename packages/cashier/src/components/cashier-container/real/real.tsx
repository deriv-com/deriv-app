import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import CashierBreadcrumb from '../../cashier-breadcrumb';
import { useCashierStore } from '../../../stores/useCashierStores';
import './real.scss';

const Real = observer(({ is_deposit = false }: { is_deposit?: boolean }) => {
    const {
        traders_hub: { is_low_risk_cr_eu_real },
        ui: { is_dark_mode_on },
    } = useStore();

    const { iframe, deposit, general_store } = useCashierStore();

    const { clearIframe, iframe_height, iframe_url, changeTheme } = iframe;

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
        changeTheme();
    }, [changeTheme, is_dark_mode_on]);

    return (
        <div className='cashier__wrapper real'>
            {should_show_loader && <Loading className='real__loader' />}
            {should_show_breadcrumbs && <CashierBreadcrumb />}
            {iframe_url && (
                <iframe
                    className='cashier__content'
                    height={iframe_height}
                    src={iframe_url}
                    frameBorder='0'
                    scrolling='auto'
                    data-testid='dt_doughflow_section'
                />
            )}
        </div>
    );
});

export default Real;
