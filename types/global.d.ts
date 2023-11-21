declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: {
            init: () => void;
            on: (key: string, callback: VoidFunction) => void;
            get: (key: string) => any;
            call: (key: string, value?: any) => void;
        };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            init: (args: any) => any;
        };
        /** @deprecated `DocumentTouch` has been removed from the standards, use `Touch` or `TouchList` instead. */
        DocumentTouch: any;
        opera?: string;
        MSStream?: {
            readonly type: string;
            msClose: () => void;
            msDetachStream: () => void;
        };
    }
    // https://wicg.github.io/ua-client-hints/#navigatorua
    interface NavigatorUA {
        readonly userAgentData?: NavigatorUAData;
    }
    // WICG Spec: https://wicg.github.io/ua-client-hints
    interface Navigator extends NavigatorUA {
        msMaxTouchPoints: number;
    }
    // https://wicg.github.io/ua-client-hints/#dictdef-navigatoruabrandversion
    interface NavigatorUABrandVersion {
        readonly brand: string;
        readonly version: string;
    }
    // https://wicg.github.io/ua-client-hints/#dictdef-uadatavalues
    interface UADataValues {
        readonly brands?: NavigatorUABrandVersion[];
        readonly mobile?: boolean;
        readonly platform?: string;
        readonly architecture?: string;
        readonly bitness?: string;
        readonly model?: string;
        readonly platformVersion?: string;
        /** @deprecated in favour of fullVersionList */
        readonly uaFullVersion?: string;
        readonly fullVersionList?: NavigatorUABrandVersion[];
        readonly wow64?: boolean;
    }
    // https://wicg.github.io/ua-client-hints/#dictdef-ualowentropyjson
    interface UALowEntropyJSON {
        readonly brands: NavigatorUABrandVersion[];
        readonly mobile: boolean;
        readonly platform: string;
    }

    // https://wicg.github.io/ua-client-hints/#navigatoruadata
    interface NavigatorUAData extends UALowEntropyJSON {
        getHighEntropyValues(hints: string[]): Promise<UADataValues>;
        toJSON(): UALowEntropyJSON;
    }
}

export {};
