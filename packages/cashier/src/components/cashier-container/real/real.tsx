import React from 'react';
import { Loading } from '@deriv/components';
import ArrowBack from '../../arrow-back';
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
    const should_show_arrow_back = !is_eu && is_deposit && Boolean(iframe_height);
    const should_show_loader = is_loading || !iframe_height;

    React.useEffect(() => {
        return () => {
            clearIframe();
            onMountDeposit?.();
        };
    }, [clearIframe, onMountDeposit]);

    return (
        <div className='cashier__wrapper real'>
            {should_show_loader && <Loading className='real__loader' />}
            {should_show_arrow_back && (
                <div className='real__header'>
                    <ArrowBack onClickHandler={() => setIsDeposit?.(false)} />
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
