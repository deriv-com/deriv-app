import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DataListTemplateEntry from './data-list-template-entry';
import { ApplicationObject } from '@deriv/api-types';

type TDataListTemplate = { data_source: ApplicationObject; handleToggleModal: (app_id: number) => void };

const DataListTemplate = ({ data_source, handleToggleModal }: TDataListTemplate) => {
    const permissions =
        data_source?.scopes?.map(scope => scope.charAt(0).toUpperCase().concat(scope.substring(1))).join(', ') ?? '';

    return (
        <div className='connected-apps__list--template'>
            <div className='connected-apps__list--row'>
                <div className='connected-apps__list--name'>
                    <DataListTemplateEntry title='Name' content={data_source.name} />
                </div>
                <div className='connected-apps__list--last-login'>
                    <DataListTemplateEntry title='Last login' content={data_source.last_used ?? ''} />
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
        </div>
    );
};

export default DataListTemplate;
