export type TFile = {
    path: string;
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

export type TPlatformContext = {
    is_appstore: boolean;
    displayName: string;
};
