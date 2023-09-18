import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { getCFDPlatformLabel } from '@deriv/shared';

type TPasswordModalHeaderProps = {
    should_set_trading_password: boolean;
    is_password_reset_error: boolean;
    platform: string;
    has_mt5_account?: boolean;
};

const PasswordModalHeader = observer(
    ({ should_set_trading_password, is_password_reset_error, platform }: TPasswordModalHeaderProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const element = is_mobile ? 'p' : 'span';
        const alignment = 'center';
        const font_size = 's';

        return (
            <Text
                align={alignment}
                as={element}
                className='cfd-password-modal__header'
                line_height='m'
                size={font_size}
                weight='bold'
            >
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
    }
);

export default PasswordModalHeader;
