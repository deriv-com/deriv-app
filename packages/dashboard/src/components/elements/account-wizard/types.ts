export type TWizardItemConfig = {
    header: {
        active_title: string;
        title: string;
    };
    body: React.FC<any>;
    form_value?: {
        [x: string]: unknown;
    };
    props: {
        validate?: () => boolean;
    };
    passthrough: string[];
    icon?: string;
};
