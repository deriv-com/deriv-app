import React from 'react';
import { Loading } from '@deriv/components';

type TRealProps = {
    iframe_height: number | string;
    iframe_url: string;
    changeTheme: VoidFunction;
    clearIframe: VoidFunction;
    is_dark_mode_on: boolean;
    is_loading: boolean;
};

const Real = ({ iframe_height, iframe_url, clearIframe, is_loading, changeTheme, is_dark_mode_on }: TRealProps) => {
    React.useEffect(() => {
        return () => {
            clearIframe();
        };
    }, [clearIframe]);

    React.useEffect(() => {
        changeTheme();
    }, [changeTheme, is_dark_mode_on]);

    return (
        <div className='cashier__wrapper'>
            {is_loading && <Loading is_fullscreen />}
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
