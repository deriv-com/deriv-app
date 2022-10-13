//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import Recent from './load-bot-preview/recent';
import SaveModalStore from 'Stores/save-modal-store';
import GoogleDrive from './load-bot-preview/google-drive';

type Nullable<T> = T | null;
type CardsProps = {
    load_modal: LoadModalStore;
    active_tab: number;
    has_file_loaded: boolean;
    setActiveTab: (active_tab: number) => void;
    openFileLoader: () => void;
    onConfirmSave: () => void;
    handleFileChange: () => void;
    setLoadedLocalFile: () => void;
    onDriveConnect: () => void;
    loadFileFromLocal: () => void;
    save_modal: SaveModalStore;
    setFileLoaded: (param: boolean) => void;
    is_dialog_open: boolean;
    is_running: boolean;
    closeResetDialog: () => void;
    onOkButtonClick: () => void;
    showVideoDialog: (type: string, url?: string, component?: React.ReactNode) => void;
    dialog_options: { [key: string]: string };
};

const Cards = ({
    handleFileChange,
    setActiveTab,
    onConfirmSave,
    setLoadedLocalFile,
    onDriveConnect,
    loadFileFromLocal,
    setFileLoaded,
    has_file_loaded,
    is_dialog_open,
    showVideoDialog,
    closeResetDialog,
    dialog_options,
}: CardsProps) => {
    type TCardArray = {
        icon: string;
        content: string;
        method: () => void;
        disable: string | '';
    };
    const openGoogleDriveDialog = () => {
        showVideoDialog('', 'google', <GoogleDrive />);
    };
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);

    const clear_preview_ref = React.useRef<HTMLInputElement | null>(null);
    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };
    const [icon_array, SetIconArray] = React.useState<TCardArray[] | []>([]);
    React.useEffect(() => {
        const IconArray: TCardArray[] = [
            {
                icon: 'IcMyComputer',
                content: 'My computer',
                method: openFileLoader,
                disable: has_file_loaded ? 'disabled--card' : '',
            },
            {
                icon: 'IcGoogleDriveDbot',
                content: 'Google Drive',
                method: openGoogleDriveDialog,
                disable: has_file_loaded ? 'disabled--card' : '',
            },
            {
                icon: 'IcBotBuilder',
                content: 'Bot Builder',
                method: () => setActiveTab(1),
                disable: '',
            },
            {
                icon: 'IcQuickStrategy',
                content: 'Quick Strategy',
                method: () => setActiveTab(2),
                disable: '',
            },
        ];
        SetIconArray(IconArray);
    }, [has_file_loaded]);

    return (
        <div>
            <div
                className='dc-tabs__content_group_tiles'
                id='dc-tabs__content_group_tiles'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {icon_array.map((icons, index) => {
                    const { icon, content, method, disable } = icons;
                    return (
                        <div
                            key={index}
                            className={`dc-tabs__content_group_tiles_block ${disable}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                marginRight: '1rem',
                            }}
                        >
                            <Icon
                                className={'dc-tabs__content_group_tiles_images'}
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
                <input
                    type='file'
                    ref={file_input_ref}
                    accept='.xml'
                    style={{ display: 'none' }}
                    onChange={e => {
                        //setLoadedLocalFile(null);
                        clear_preview_ref.current?.click();
                        onConfirmSave();
                        setIsFileSupported(handleFileChange(e, false));
                        loadFileFromLocal();
                        setFileLoaded(true);
                    }}
                />
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    onCancel={closeResetDialog}
                    is_mobile_full_width
                    className={'dc-dialog__wrapper--fixed dc-dialog__wrapper--googledrive'}
                    has_close_icon
                >
                    {dialog_options.message}
                </Dialog>
            </div>
            <Recent />
        </div>
    );
};

export default connect(({ load_modal, dashboard, save_modal }: RootStore) => ({
    load_modal,
    active_tab: dashboard.active_tab,
    has_file_loaded: dashboard.has_file_loaded,
    setFileLoaded: dashboard.setFileLoaded,
    setActiveTab: dashboard.setActiveTab,
    handleFileChange: load_modal.handleFileChange,
    toggleLoadModal: load_modal.toggleLoadModal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    onConfirmSave: save_modal.onConfirmSave,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    onDriveConnect: load_modal.onDriveConnect,
    is_dialog_open: dashboard.is_dialog_open,
    onOkButtonClick: dashboard.onCloseDialog,
    closeResetDialog: dashboard.onCloseDialog,
    showVideoDialog: dashboard.showVideoDialog,
    dialog_options: dashboard.dialog_options,
}))(Cards);
