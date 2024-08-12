import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from '../../../stores/useCashierStores';
import './real.scss';

const Real = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { iframe, general_store } = useCashierStore();
    const { clearIframe, iframe_height, iframe_url, checkIframeLoaded, setContainerHeight } = iframe;
    const { is_loading } = general_store;
    const should_show_loader = is_loading || !iframe_height;

    React.useEffect(() => {
        return () => {
            clearIframe();
        };
    }, [clearIframe]);

    React.useEffect(() => {
        // To show loading state when switching theme
        setContainerHeight(0);
        checkIframeLoaded();
    }, [checkIframeLoaded, is_dark_mode_on, setContainerHeight]);

    return (
        <React.Fragment>
            {should_show_loader && <Loading className='real__loader' />}
            {iframe_url && (
                <iframe
                    className='cashier__content real__iframe'
                    height={iframe_height}
                    src={`${iframe_url}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}`}
                    frameBorder='0'
                    scrolling='auto'
                    data-testid='dt_doughflow_section'
                />
            )}
        </React.Fragment>
    );
});

export default Real;
