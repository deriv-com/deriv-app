import { TStringTranslation } from 'Types';

export type TTradeModal = {
    balance: string;
    icon: string;
    title: TStringTranslation;
    launch_apps: TLaunchApps[];
    qrcode_data: TQrcodeData;
};

export type TTradeModalHeader = {
    balance: string;
    icon: string;
    title: TStringTranslation;
    toggleTradeModal: () => void;
};

export type TTradeModalBody = {
    launch_apps: TLaunchApps[];
    qrcode_data: TQrcodeData;
};

export type TLaunchApps = {
    app_title: TStringTranslation;
    icon: string;
    click: () => void;
};

export type TQrcodeData = {
    filename: string;
    subtitle: string;
};
