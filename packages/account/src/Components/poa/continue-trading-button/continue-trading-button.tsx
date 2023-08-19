import React from 'react';
import classNames from 'classnames';
import { ButtonLink, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

export const ContinueTradingButton = ({ className }: { className?: string }) => (
    <ButtonLink className={classNames('account-management__button', className)} to='/'>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='continue_btn_text'>
            {localize('Continue trading')}
        </Text>
    </ButtonLink>
);
