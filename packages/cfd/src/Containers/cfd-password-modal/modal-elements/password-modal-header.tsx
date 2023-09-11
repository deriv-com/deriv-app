import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCFDPlatformLabel, isMobile } from '@deriv/shared';

type TPasswordModalHeaderProps = {
    should_set_trading_password: boolean;
    is_password_reset_error: boolean;
    platform: string;
    has_mt5_account?: boolean;
};

const PasswordModalHeader = ({
    should_set_trading_password,
    is_password_reset_error,
    platform,
}: TPasswordModalHeaderProps) => {
    const element = isMobile() ? 'p' : 'span';
    const alignment = 'center';
    const font_size = 's';
    const style = isMobile()
        ? {
              padding: '2rem',
          }
        : {};

    return (
        <Text styles={style} as={element} line_height='m' weight='bold' size={font_size} align={alignment}>
            {!should_set_trading_password && !is_password_reset_error && (
                <Localize
                    i18n_default_text='Enter your {{platform}} password'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            )}
            {is_password_reset_error && <Localize i18n_default_text='Too many attempts' />}
        </Text>
    );
};

export default PasswordModalHeader;
