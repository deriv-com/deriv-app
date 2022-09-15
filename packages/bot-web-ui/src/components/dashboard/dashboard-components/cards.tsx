//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';

type CardsProps = {
    load_modal: LoadModalStore;
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
    openFileLoader: () => void;
};

const Cards = ({ load_modal, setActiveTab, openFileLoader }: CardsProps) => {
    const { onDriveConnect, toggleLoadModal, handleFileChange } = load_modal;
    const IconArray = [
        {
            icon: 'IcMyComputer',
            content: 'My computer',
            method: openFileLoader,
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: 'Google Drive',
            method: onDriveConnect,
        },
        {
            icon: 'IcBotBuilder',
            content: 'Bot Builder',
            method: () => setActiveTab(1),
        },
        {
            icon: 'IcQuickStrategy',
            content: 'Quick Strategy',
            method: () => setActiveTab(2),
        },
    ];

    return (
        <>
            <div className='dc-tabs__content_group_tiles' id='dc-tabs__content_group_tiles'>
                {IconArray.map((icons, index) => {
                    const { icon, content, method } = icons;
                    return (
                        <div key={index} className='dc-tabs__content_group_tiles_block'>
                            <Icon
                                className='dc-tabs__content_group_tiles_images'
                                width='8rem'
                                height='8rem'
                                style={{ backgroundColor: `#F2F3F4` }}
                                icon={icon}
                                id={icon}
                                onClick={method}
                            />

                            <span className='dc-tabs__content_group_tiles_content'>{localize(content)}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default connect((store: RootStore) => ({
    load_modal: store.load_modal,
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
    handleFileChange: store.load_modal.handleFileChange,
    toggleLoadModal: store.load_modal.toggleLoadModal,
}))(Cards);
