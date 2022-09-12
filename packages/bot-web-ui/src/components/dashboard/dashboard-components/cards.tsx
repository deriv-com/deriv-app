//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

type TCard = {
    load_modal: LoadModalStore;
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
};

const Cards = ({ load_modal, setActiveTab }: TCard) => {
    const { onDriveConnect } = load_modal;
    const actions = [
        {
            icon: 'IcMyComputer',
            content: localize('My computer'),
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            method: onDriveConnect,
        },
        {
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            method: () => setActiveTab(1),
        },
        {
            icon: 'IcQuickStrategy',
            content: localize('Quick Strategy'),
            method: () => setActiveTab(2),
        },
    ];

    return (
        <div className='dc-tabs__dashboard-cards-wrapper' id='dc-tabs__content_group_tiles'>
            {actions.map(({ icon, content, method }, index) => (
                <div key={index} className='dc-tabs__dashboard-card'>
                    <Icon
                        className='dc-tabs__dashboard-card-image'
                        width='8rem'
                        height='8rem'
                        icon={icon}
                        id={icon}
                        onClick={method}
                    />
                    <span className='dc-tabs__dashboard-card-label'>{localize(content)}</span>
                </div>
            ))}
        </div>
    );
};

export default connect((store: RootStore) => ({
    load_modal: store.load_modal,
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
}))(Cards);
