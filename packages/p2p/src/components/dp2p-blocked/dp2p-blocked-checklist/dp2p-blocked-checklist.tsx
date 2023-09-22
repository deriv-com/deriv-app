import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Checklist } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores/index'; // remove index when store migration to ts is done

const Dp2pBlockedChecklist = () => {
    const { general_store } = useStores();
    const history = useHistory();

    if (general_store.is_high_risk && !general_store.is_blocked) {
        const checklist_items = [
            {
                content: localize('Complete the financial assessment form'),
                status: 'action',
                onClick: () =>
                    history.push({
                        pathname: routes.financial_assessment,
                    }),
            },
        ];

        return (
            <div className='dp2p-blocked-checklist__container'>
                <Checklist className='dp2p-blocked-checklist' items={checklist_items} />
            </div>
        );
    }

    return null;
};

export default observer(Dp2pBlockedChecklist);
