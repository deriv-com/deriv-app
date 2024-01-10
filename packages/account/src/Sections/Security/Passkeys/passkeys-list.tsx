import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import FormBody from '../../../Components/form-body';
import FormFooter from '../../../Components/form-footer';
import PasskeyCard from './passkey-card';

type TPasskeysList = {
    passkeys_list: React.ComponentProps<typeof PasskeyCard>[];
    onButtonClick: () => void;
    is_creation_available: boolean;
};

const PasskeysList = ({ passkeys_list, onButtonClick, is_creation_available }: TPasskeysList) => {
    return (
        <React.Fragment>
            <FormBody scroll_offset='18rem'>
                {passkeys_list.map(passkey => (
                    <PasskeyCard {...passkey} key={passkey.id} />
                ))}
            </FormBody>
            {is_creation_available && (
                <FormFooter>
                    <Button type='button' has_effect primary onClick={onButtonClick}>
                        {<Localize i18n_default_text='Create passkey' />}
                    </Button>
                </FormFooter>
            )}
        </React.Fragment>
    );
};

export default PasskeysList;
