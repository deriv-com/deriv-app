import React from 'react';
import { ButtonLink, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

type PoaButtonProps = {
    custom_text: unknown | string;
};

export const PoaButton = ({ custom_text = localize('Submit proof of address') }: PoaButtonProps) => (
    <ButtonLink className='account-management__button' to={routes.proof_of_address}>
        <Text className='dc-btn__text' as='p' weight='bold'>
            {custom_text}
        </Text>
    </ButtonLink>
);
