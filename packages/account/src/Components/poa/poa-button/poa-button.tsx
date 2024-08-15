import React from 'react';
import { ButtonLink, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';

type TPoaButton = {
    custom_text?: React.ReactNode;
    class_name?: string;
};

const DEFAULT_BTN_TEXT = <Localize i18n_default_text='Submit proof of address' />;

const PoaButton = ({ custom_text = DEFAULT_BTN_TEXT, class_name }: TPoaButton) => (
    <ButtonLink className={clsx('account-management__button', class_name)} to={routes.proof_of_address}>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='poa_button_text'>
            {custom_text}
        </Text>
    </ButtonLink>
);

export default PoaButton;
