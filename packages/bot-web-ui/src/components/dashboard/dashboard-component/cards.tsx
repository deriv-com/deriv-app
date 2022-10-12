//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

type TCard = {
    load_modal: LoadModalStore;
    setActiveTab: (active_tab: number) => void;
};

const Cards = ({ load_modal, setActiveTab }: TCard) => {
    const { onDriveConnect } = load_modal;
    const actions = [
        {
            icon: 'IcMyComputer',
            label: localize('My computer'),
        },
        {
            icon: 'IcGoogleDriveDbot',
            label: localize('Google Drive'),
            method: onDriveConnect,
        },
        {
            icon: 'IcBotBuilder',
            label: localize('Bot Builder'),
            method: () => setActiveTab(1),
        },
        {
            icon: 'IcQuickStrategy',
            label: localize('Quick Strategy'),
            method: () => setActiveTab(2),
        },
    ];

    return React.useMemo(
        () => (
            <div className='dc-tabs__dashboard-cards-wrapper' id='db-dashboard-cards'>
                {actions.map(({ icon, label, method }) => (
                    <div key={label} className='dc-tabs__dashboard-card'>
                        <Icon
                            className='dc-tabs__dashboard-card__image'
                            width='8rem'
                            height='8rem'
                            icon={icon}
                            id={icon}
                            onClick={method}
                        />
                        <Text size='xxs' line_height='s' color='prominent'>
                            {label}
                        </Text>
                    </div>
                ))}
            </div>
        ),
        []
    );
};

export default connect(({ load_modal, dashboard }: RootStore) => ({
    load_modal,
    setActiveTab: dashboard.setActiveTab,
}))(Cards);
