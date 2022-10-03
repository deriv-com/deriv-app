import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import Local from './load-bot-preview/local';
import AppStore from 'Stores/app-store';

type TDashboardProps = {
    load_modal: LoadModalStore;
    app: AppStore;
};
type TgetFile = {
    getFile: [];
};
const getFile: TgetFile[] = [];
const Dashboard = ({ load_modal, app }: TDashboardProps) => {
    const { handleFileChange, onEntered } = load_modal;
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const { onMount, onUnmount } = app;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);
    return (
        <div style={{ display: 'flex' }}>
            <div className='dc-tabs__content_group'>
                <span className='dc-tabs__content_group_heading'>{localize('Load or build your bot')}</span>
                <span className='dc-tabs__content_group_description'>
                    {localize(
                        'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                    )}
                </span>
                <Cards />
            </div>
            <div style={{ width: '50%' }}>
                <Local />
            </div>
        </div>
    );
};

export default connect((store: RootStore) => ({
    load_modal: store.load_modal,
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
    handleFileChange: store.load_modal.handleFileChange,
    toggleLoadModal: store.load_modal.toggleLoadModal,
    onMount: store.main_content.onMount,
    onUnmount: store.main_content.onUnmount,
    app: store.app,
}))(Dashboard);
