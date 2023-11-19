export type TContractType = {
    text?: string;
    value: string;
};

export type TContractCategory = {
    component?: JSX.Element | null;
    contract_types: TContractType[];
    icon?: string;
    is_unavailable?: boolean;
    key: string;
    label?: string;
};

export type TList = {
    component?: JSX.Element | null;
    contract_categories?: TContractCategory[];
    contract_types?: TContractType[];
    icon: string;
    label?: string;
    key: string;
};

export type TVideo = {
    uid: string;
    creator: null | string;
    thumbnail: string;
    thumbnailTimestampPct: number;
    readyToStream: boolean;
    readyToStreamAt: string;
    status: {
        state: string;
        pctComplete: string;
        errorReasonCode: string;
        errorReasonText: string;
    };
    meta: {
        filename: string;
        filetype: string;
        name: string;
        relativePath: string;
        type: string;
    };
    created: string;
    modified: string;
    scheduledDeletion: null | string;
    size: number;
    preview: string;
    allowedOrigins: string[];
    requireSignedURLs: boolean;
    uploaded: string;
    uploadExpiry: string;
    maxSizeBytes: null | number;
    maxDurationSeconds: null | number;
    duration: number;
    input: {
        width: number;
        height: number;
    };
    playback: {
        hls: string;
        dash: string;
    };
    watermark: null | string;
    clippedFrom: null | string;
    publicDetails: {
        title: string;
        share_link: string;
        channel_link: string;
        logo: string;
    };
};
