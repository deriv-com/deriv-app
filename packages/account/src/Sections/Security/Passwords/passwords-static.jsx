import React from 'react';
import PropTypes from 'prop-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Popover, Text } from '@deriv/components';
import DerivComLogo from '../../../Assets/ic-brand-deriv-red.svg';
import DerivGoLight from '../../../Assets/ic-brand-deriv-go-light.svg';
import DerivGoDark from '../../../Assets/ic-brand-deriv-go-dark.svg';

const PasswordsStatic = ({ is_dark_mode_on, is_deriv_password = false, is_trading_password_required = false }) => (
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
                <div className='passwords-static__logo-container'>
                    <DerivComLogo className='passwords-static__single-icon' />
                    <Text line_height='l' size='xs' weight='bold'>
                        Deriv.com
                    </Text>
                </div>
                <div className='passwords-static__icons'>
                    <Popover alignment='bottom' message={localize('DTrader')}>
                        <Icon icon='IcBrandDtrader' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message={localize('DBot')}>
                        <Icon icon='IcBrandDbot' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message={localize('SmartTrader')}>
                        <Icon icon='IcBrandSmarttrader' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message={localize('Deriv GO')}>
                        {is_dark_mode_on ? <DerivGoDark /> : <DerivGoLight />}
                    </Popover>
                </div>
            </div>
        ) : (
            <div className='account__passwords-item-left'>
                <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                    {localize('Use this to log in and trade with Deriv MT5 and Deriv X.')}
                </Text>
                {!is_trading_password_required && (
                    <React.Fragment>
                        <Text className='passwords-static__text' color='less-prominent' size='xs' weight='lighter'>
                            {localize('Apps you have linked to this password:')}
                        </Text>
                        <div className='passwords-static__icons'>
                            <Popover alignment='bottom' message={localize('Deriv MT5')}>
                                <Icon icon='IcBrandDmt5' size={32} />
                            </Popover>
                        </div>
                    </React.Fragment>
                )}
            </div>
        )}
    </React.Fragment>
);

PasswordsStatic.prototype = {
    is_deriv_password: PropTypes.boolean,
    is_trading_password_required: PropTypes.boolean,
};

export default PasswordsStatic;
