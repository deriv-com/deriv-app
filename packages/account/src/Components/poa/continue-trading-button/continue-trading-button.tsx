import React from 'react';
import classNames from 'classnames';
import { ButtonLink, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

export const ContinueTradingButton = ({ className }: { className?: string }) => (
    <ButtonLink className={classNames('account-management__button', className)} to='/'>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='continue_btn_text'>
            <Localize i18n_default_text='Continue trading' />
        </Text>
    </ButtonLink>
);
