import React from 'react';
import PropTypes from 'prop-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import DerivComLogo from '../../../Assets/ic-brand-deriv-red.svg';
import DerivGoLight from '../../../Assets/ic-brand-deriv-go-light.svg';
import DerivGoDark from '../../../Assets/ic-brand-deriv-go-dark.svg';

const PasswordsStatic = ({ is_dark_mode_on, is_deriv_password = false }) => (
    <React.Fragment>
        {is_deriv_password ? (
            <div className='account__passwords-item-left'>
                <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                    <Localize
                        i18n_default_text='Use this to log in to Deriv.com, Deriv Go, DTrader,<0 /> SmartTrader, and DBot.'
                        components={[<br key={0} />]}
                    />
                </Text>
                <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                    {localize('Apps you have linked to this password:')}
                </Text>
                <DerivComLogo className='passwords-static__single-icon' />
                <div className='passwords-static__icons'>
                    <Icon icon='IcBrandDtrader' size={32} />
                    <Icon icon='IcBrandDbot' size={32} />
                    <Icon icon='IcBrandSmarttrader' size={32} />
                    {is_dark_mode_on ? <DerivGoDark /> : <DerivGoLight />}
                </div>
            </div>
        ) : (
            <div className='account__passwords-item-left'>
                <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                    {localize('Use this to log in and trade with MT5 and DXTrade.')}
                </Text>
                <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                    {localize('Apps you have linked to this password:')}
                </Text>
                <div className='passwords-static__icons'>
                    <Icon icon='IcBrandDmt5' size={32} />
                </div>
            </div>
        )}
    </React.Fragment>
);

PasswordsStatic.prototype = {
    is_deriv_password: PropTypes.boolean,
};

export default PasswordsStatic;
