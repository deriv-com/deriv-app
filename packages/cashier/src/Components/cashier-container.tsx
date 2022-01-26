import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Button, Loading, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import 'Sass/cashier-container.scss';

type CashierContainerProps = {
    iframe_height: unknown | number | string;
    iframe_url: string;
    clearIframe: () => void;
    is_crypto: boolean;
    is_loading: boolean;
};

const CashierContainer = ({ iframe_height, iframe_url, clearIframe, is_crypto, is_loading }: CashierContainerProps) => {
    const history = useHistory();

    React.useEffect(() => {
        return () => {
            clearIframe();
        };
    }, [clearIframe]);

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
                />
            )}
            {is_crypto && (
                <div className='cashier-container__transfer-onramp'>
                    <div className='cashier-container__transfer-onramp__header'>
                        <Text line_height='xxl'>
                            <Localize i18n_default_text='Looking for a way to buy cryptocurrency?' />
                        </Text>
                    </div>
                    <div>
                        <Button
                            className='cashier-container__transfer-onramp__button'
                            has_effect
                            text={localize('Try our Fiat onramp')}
                            onClick={() => history.push(routes.cashier_onramp)}
                            primary
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashierContainer;
