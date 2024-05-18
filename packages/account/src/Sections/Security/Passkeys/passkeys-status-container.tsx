import React from 'react';
import { observer } from '@deriv/stores';
import './passkeys.scss';
import { NoPasskeys } from './components/no-passkeys';
import { PasskeyRename } from './components/passkey-rename';
import { PasskeysList } from './components/passkeys-list';
import { PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import { PasskeyCreated } from './components/passkey-created';
import { TPasskeysButtonOnClicks } from './components/passkeys-status-layout';
import { PasskeyCard } from './components/passkey-card';
import { PasskeysLearnMore } from './components/passkeys-learn-more';

type TPasskeysStatusContainer = {
    passkey_status: TPasskeysStatus;
    passkeys_list: React.ComponentProps<typeof PasskeyCard>[];
} & TPasskeysButtonOnClicks;

export const PasskeysStatusContainer = observer(
    ({ onPrimaryButtonClick, onSecondaryButtonClick, passkeys_list, passkey_status }: TPasskeysStatusContainer) => {
        switch (passkey_status) {
            case PASSKEY_STATUS_CODES.CREATED:
                return (
                    <PasskeyCreated
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.LEARN_MORE:
                return (
                    <PasskeysLearnMore
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.NO_PASSKEY:
                return (
                    <NoPasskeys
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
            case PASSKEY_STATUS_CODES.RENAMING:
                return (
                    <PasskeyRename
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );

            default:
                return (
                    <PasskeysList
                        passkeys_list={passkeys_list || []}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
        }
    }
);
