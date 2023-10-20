import React from 'react';
import { ApplicationObject } from '@deriv/api-types';
import { Button } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import DataListTemplateEntry from './data-list-template-entry';
import { getConnectedAppsScopes } from './template-helper';

type TDataListTemplate = { data_source: ApplicationObject; handleToggleModal: (app_id: number) => void };

const DataListTemplate = ({ data_source, handleToggleModal }: TDataListTemplate) => (
    <div className='connected-apps__list--template'>
        <div className='connected-apps__list--row'>
            <div className='connected-apps__list--name'>
                <DataListTemplateEntry title={<Localize i18n_default_text='Name' />} content={data_source.name} />
            </div>
            <div className='connected-apps__list--last-login'>
                <DataListTemplateEntry
                    title={<Localize i18n_default_text='Last login' />}
                    content={toMoment(data_source.last_used).format('YYYY-MM-DD HH:mm:ss')}
                />
            </div>
        </div>
        <div className='connected-apps__list--row'>
            <div className='connected-apps__list--permission'>
                <DataListTemplateEntry
                    title={<Localize i18n_default_text='Permission' />}
                    content={getConnectedAppsScopes(data_source.scopes ?? [])}
                />
            </div>
            <div className='connected-apps__list--revoke'>
                <Button small secondary onClick={() => handleToggleModal(data_source.app_id)}>
                    <Localize i18n_default_text='Revoke access' />
                </Button>
            </div>
        </div>
    </div>
);

export default DataListTemplate;
