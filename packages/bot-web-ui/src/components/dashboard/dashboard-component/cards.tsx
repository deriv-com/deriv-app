//kept sometihings commented beacuse of mobx to integrate popup functionality here
import { DesktopWrapper, Dialog, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { DBOT_TABS } from 'Constants/bot-contents';
import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import SaveModalStore from 'Stores/save-modal-store';
import GoogleDrive from './load-bot-preview/google-drive';
import Recent from './load-bot-preview/recent';

type TCardProps = {
    dialog_options: { [key: string]: string };
    has_dashboard_strategies: boolean;
    is_dialog_open: boolean;
    is_mobile: boolean;
    save_modal: SaveModalStore;
    closeResetDialog: () => void;
    handleFileChange: (e: React.ChangeEvent, flag?: boolean) => boolean;
    loadFileFromLocal: () => void;
    loadDataStrategy: () => void;
    setActiveTab: (active_tab: number) => void;
    setFileLoaded: (param: boolean) => void;
    setPreviewOnPopup: (show: boolean) => void;
    setOpenSettings: (toast_message: string, show_toast?: boolean) => void;
    showVideoDialog: (param: { [key: string]: string | React.ReactNode }) => void;
};

type TCardArray = {
    icon: string;
    content: string;
    method: () => void;
};

const Cards = ({
    closeResetDialog,
    dialog_options,
    handleFileChange,
    has_dashboard_strategies,
    is_dialog_open,
    is_mobile,
    loadFileFromLocal,
    setActiveTab,
    setFileLoaded,
    setPreviewOnPopup,
    setOpenSettings,
    showVideoDialog,
    loadDataStrategy,
}: TCardProps) => {
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);

    const openGoogleDriveDialog = () => {
        showVideoDialog({
            type: 'google',
        });
    };

    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };

    const actions: TCardArray[] = [
        {
            icon: is_mobile ? 'IcLocal' : 'IcMyComputer',
            content: is_mobile ? localize('Local') : localize('My computer'),
            method: openFileLoader,
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            method: openGoogleDriveDialog,
        },
        {
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            method: () => setActiveTab(DBOT_TABS.BOT_BUILDER),
        },
        {
            icon: 'IcQuickStrategy',
            content: localize('Quick strategy'),
            method: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                loadDataStrategy();
            },
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, method } = icons;
                        return (
                            <div
                                key={content}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                })}
                            >
                                <Icon
                                    className={classNames('tab__dashboard__table__images', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={icon}
                                    onClick={method}
                                />
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                                    {content}
                                </Text>
                            </div>
                        );
                    })}
                    <input
                        type='file'
                        ref={file_input_ref}
                        accept='.xml'
                        hidden
                        onChange={e => {
                            setIsFileSupported(handleFileChange(e, false));
                            loadFileFromLocal();
                            setFileLoaded(true);
                            setOpenSettings('import');
                        }}
                    />
                    <DesktopWrapper>
                        <Dialog
                            title={dialog_options.title}
                            is_visible={is_dialog_open}
                            onCancel={closeResetDialog}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--google-drive'
                            has_close_icon
                        >
                            <GoogleDrive />
                        </Dialog>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileFullPageModal
                            is_modal_open={is_dialog_open}
                            className='load-strategy__wrapper'
                            header={localize('Load strategy')}
                            onClickClose={() => {
                                setPreviewOnPopup(false);
                                closeResetDialog();
                            }}
                            height_offset='80px'
                            page_overlay
                        >
                            <div label='Google Drive' className='google-drive-label'>
                                <GoogleDrive />
                            </div>
                        </MobileFullPageModal>
                    </MobileWrapper>
                </div>
                <Recent is_file_supported={is_file_supported} />
            </div>
        ),
        [is_dialog_open, has_dashboard_strategies]
    );
};

export default connect(({ load_modal, dashboard, quick_strategy }: RootStore) => ({
    closeResetDialog: dashboard.onCloseDialog,
    dialog_options: dashboard.dialog_options,
    handleFileChange: load_modal.handleFileChange,
    is_dialog_open: dashboard.is_dialog_open,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    onDriveConnect: load_modal.onDriveConnect,
    setActiveTab: dashboard.setActiveTab,
    setFileLoaded: dashboard.setFileLoaded,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
    setOpenSettings: dashboard.setOpenSettings,
    showVideoDialog: dashboard.showVideoDialog,
    loadDataStrategy: quick_strategy.loadDataStrategy,
}))(Cards);
