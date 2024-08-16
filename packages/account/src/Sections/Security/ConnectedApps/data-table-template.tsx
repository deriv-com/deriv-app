import { Fragment } from 'react';
import clsx from 'clsx';
import { OauthApps } from '@deriv/api-types';
import { Button, Text } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';
import { getConnectedAppsColumnNames, getConnectedAppsScopes } from './template-helper';

type TDataTableTemplate = { connected_apps: OauthApps; handleToggleModal: (app_id: number) => void };

const DataTableTemplate = ({ connected_apps, handleToggleModal }: TDataTableTemplate) => (
    <div className='connected-apps__tabular--wrapper'>
        {getConnectedAppsColumnNames().map((column_name, index) => (
            <Text
                size='xs'
                weight='bold'
                key={column_name.key}
                className={clsx('connected-apps__tabular--cell connected-apps__tabular--header', {
                    'connected-apps__tabular--skip-left-padding': index === 0,
                })}
            >
                {column_name}
            </Text>
        ))}
        {connected_apps.map(connected_app => (
            <Fragment key={connected_app.app_id}>
                <Text size='xs' className='connected-apps__tabular--cell connected-apps__tabular--skip-left-padding'>
                    {connected_app.name}
                </Text>
                <Text size='xs' className='connected-apps__tabular--cell'>
                    {getConnectedAppsScopes(connected_app.scopes)}
                </Text>
                <Text size='xs' className='connected-apps__tabular--cell'>
                    {toMoment(connected_app.last_used).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
                <span className='connected-apps__tabular--cell'>
                    <Button small secondary onClick={() => handleToggleModal(connected_app.app_id)}>
                        <Localize i18n_default_text='Revoke access' />
                    </Button>
                </span>
            </Fragment>
        ))}
    </div>
);

export default DataTableTemplate;
