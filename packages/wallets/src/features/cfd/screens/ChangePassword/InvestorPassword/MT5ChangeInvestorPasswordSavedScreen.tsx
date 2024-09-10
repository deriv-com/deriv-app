import React from 'react';
import { DerivLightIcMt5PasswordUpdatedIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, useDevice } from '@deriv-com/ui';

type TProps = {
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordSavedScreen: React.FC<TProps> = ({ setNextScreen }) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    return (
        <ActionScreen
            actionButtons={
                <Button onClick={setNextScreen} size='lg' textSize={isDesktop ? 'md' : 'sm'}>
                    <Localize i18n_default_text='OK' />
                </Button>
            }
            description={localize('Your investor password has been changed.')}
            descriptionSize='sm'
            icon={<DerivLightIcMt5PasswordUpdatedIcon height={120} width={120} />}
            title={<Localize i18n_default_text='Password saved' />}
        />
    );
};

export default MT5ChangeInvestorPasswordSavedScreen;
