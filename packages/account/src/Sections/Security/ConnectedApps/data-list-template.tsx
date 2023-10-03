import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DataListTemplateEntry from './data-list-template-entry';

type TConnectedAppsEntry = {
    app_id: number;
    app_markup_percentage: number;
    last_used: string;
    name: string;
    official: number;
    scopes: string[];
};

type TDataListTemplate = { data_source: TConnectedAppsEntry; handleToggleModal: (app_id: number | null) => void };

const DataListTemplate = ({ data_source, handleToggleModal }: TDataListTemplate) => {
    const permissions = data_source.scopes
        .map(scope => scope.charAt(0).toUpperCase().concat(scope.substring(1)))
        .join(', ');

    return (
        <React.Fragment>
            <div className='connected-apps__list--row'>
                <div className='connected-apps__list--name'>
                    <DataListTemplateEntry title='Name' content={data_source.name} />
                </div>
                <div className='connected-apps__list--last-login'>
                    <DataListTemplateEntry title='Last login' content={data_source.last_used} />
                </div>
            </div>
            <div className='connected-apps__list--row'>
                <div className='connected-apps__list--permission'>
                    <DataListTemplateEntry title='Permission' content={permissions} />
                </div>
                <div className='connected-apps__list--revoke'>
                    <Button small secondary onClick={() => handleToggleModal(data_source.app_id)}>
                        <Localize i18n_default_text='Revoke access' />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default DataListTemplate;
