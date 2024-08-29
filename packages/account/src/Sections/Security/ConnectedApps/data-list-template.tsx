import { OauthApps } from '@deriv/api-types';
import { Button } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';
import DataListTemplateEntry from './data-list-template-entry';
import { getConnectedAppsScopes } from './template-helper';

type TDataListTemplate = { connected_apps: OauthApps; handleToggleModal: (app_id: number) => void };

const DataListTemplate = ({ connected_apps, handleToggleModal }: TDataListTemplate) => (
    <div className='connected-apps__list--wrapper'>
        {connected_apps.map(connected_app => (
            <div key={connected_app.app_id} className='connected-apps__list--template'>
                <div className='connected-apps__list--row'>
                    <div className='connected-apps__list--name'>
                        <DataListTemplateEntry
                            title={<Localize i18n_default_text='Name' />}
                            content={connected_app.name}
                        />
                    </div>
                    <div className='connected-apps__list--last-login'>
                        <DataListTemplateEntry
                            title={<Localize i18n_default_text='Last login' />}
                            content={toMoment(connected_app.last_used).format('YYYY-MM-DD HH:mm:ss')}
                        />
                    </div>
                </div>
                <div className='connected-apps__list--row'>
                    <div className='connected-apps__list--permission'>
                        <DataListTemplateEntry
                            title={<Localize i18n_default_text='Permission' />}
                            content={getConnectedAppsScopes(connected_app.scopes)}
                        />
                    </div>
                    <div className='connected-apps__list--revoke'>
                        <Button small secondary onClick={() => handleToggleModal(connected_app.app_id)}>
                            <Localize i18n_default_text='Revoke access' />
                        </Button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default DataListTemplate;
