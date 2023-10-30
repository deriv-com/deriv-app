import React from 'react';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { Localize } from '@deriv/translations';

type TMigrationModalDetails = Exclude<
    NonNullable<ReturnType<typeof useMT5SVGEligibleToMigrate>>['eligible_account_to_migrate_label'],
    undefined
>;

const getMigrationModalDetails = (to_account: TMigrationModalDetails) => [
    {
        key: 'have_open_positions',
        title: <Localize i18n_default_text='If you have open positions' />,
        description: [
            {
                id: 'description1',
                text: <Localize i18n_default_text='Your funds will remain in your existing MT5 account(s).' />,
            },
            {
                id: 'description2',
                text: (
                    <Localize i18n_default_text='You can continue to hold your current open positions in your existing MT5 account(s).' />
                ),
            },
            {
                id: 'description3',
                text: (
                    <Localize
                        i18n_default_text='New MT5 account(s) under the {{to_account}} jurisdiction will be created for new trades.'
                        values={{ to_account }}
                    />
                ),
            },
        ],
    },
    {
        key: 'no_open_positions',
        title: <Localize i18n_default_text='If you don’t have open positions' />,
        description: [
            {
                id: 'description1',
                text: <Localize i18n_default_text='Your funds will remain in your existing MT5 account(s).' />,
            },
            {
                id: 'description2',
                text: (
                    <Localize
                        i18n_default_text='New MT5 account(s) under the {{to_account}} jurisdiction will be created for new trades.'
                        values={{ to_account }}
                    />
                ),
            },
        ],
    },
];

export default getMigrationModalDetails;
