import React from 'react';
import clsx from 'clsx';
import { ButtonLink, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared/src/utils/routes/routes';

type TContinueTradingButtonProps = { className?: string };

/**
 * Renders a button that redirects to the trading platform
 * @name ContinueTradingButton
 * @param className - Styles to be applied to the button
 * @returns React Element
 */
export const ContinueTradingButton = ({ className }: TContinueTradingButtonProps) => (
    <ButtonLink className={clsx('account-management__button', className)} to={routes.trade}>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='continue_btn_text'>
            <Localize i18n_default_text='Continue trading' />
        </Text>
    </ButtonLink>
);
