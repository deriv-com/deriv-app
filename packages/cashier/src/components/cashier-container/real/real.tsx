import React from 'react';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Breadcrumb } from '@deriv/ui';
import './real.scss';

type TRealProps = {
    clearIframe: VoidFunction;
    iframe_height: number | string;
    iframe_url: string;
    is_deposit?: boolean;
    is_eu?: boolean;
    is_loading: boolean;
    onMountDeposit?: () => Promise<void>;
    setIsDeposit?: (value: boolean) => void;
};

const Real = ({
    clearIframe,
    iframe_height,
    iframe_url,
    is_deposit,
    is_eu,
    is_loading,
    onMountDeposit,
    setIsDeposit,
}: TRealProps) => {
    const should_show_breadcrumbs = !is_eu && is_deposit && Boolean(iframe_height);
    const should_show_loader = is_loading || !iframe_height;
    const crumbs = [localize('Cashier'), localize('Deposit via bank wire, credit card and e-wallet')];

    React.useEffect(() => {
        return () => {
            clearIframe();
            onMountDeposit?.();
        };
    }, [clearIframe, onMountDeposit]);

    const onBreadcrumbHandler = (item: string) => {
        switch (item) {
            case localize('Cashier'):
                setIsDeposit?.(false);
                break;
            default:
        }
    };

    return (
        <div className='cashier__wrapper real'>
            {should_show_loader && <Loading className='real__loader' />}
            {should_show_breadcrumbs && (
                <div className='real__header'>
                    <Breadcrumb items={crumbs} handleOnClick={onBreadcrumbHandler} />
                </div>
            )}
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
};

export default Real;
