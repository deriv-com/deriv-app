import React from 'react';
import { observer } from '@deriv/stores';
import { NoPasskeys } from './no-passkeys';
import { PASSKEY_STATUS_CODES, TPasskeysStatus } from '../passkeys-configs';
import { PasskeyCard } from './passkey-card';
import { PasskeyCreated } from './passkey-created';
import { PasskeysLearnMore } from './passkeys-learn-more';
import { PasskeysList } from './passkeys-list';
import { PasskeyRename } from './passkey-rename';
import { TPasskeysButtonOnClicks } from './passkeys-status-layout';

type TPasskeysStatusContainer = {
    passkey_status: TPasskeysStatus;
    passkeys_list: React.ComponentProps<typeof PasskeyCard>[];
    onCardMenuClick?: () => void;
} & TPasskeysButtonOnClicks;

export const PasskeysStatusContainer = observer(
    ({
        onPrimaryButtonClick,
        onSecondaryButtonClick,
        passkeys_list,
        passkey_status,
        onCardMenuClick,
    }: TPasskeysStatusContainer) => {
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
                        onCardMenuClick={onCardMenuClick}
                        passkeys_list={passkeys_list || []}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={onSecondaryButtonClick}
                    />
                );
        }
    }
);
