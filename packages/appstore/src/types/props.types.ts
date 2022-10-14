import ConfigStore from 'Stores/config-store';

export type TConfigProps = {
    has_router: boolean;
    routes: ConfigStore['routes'];
};

type ReactTypes = React.ComponentType | React.ElementType;

type TLocalizeProps = {
    components?: ReactTypes[];
    i18n?: unknown;
    i18n_default_text: string;
    values?: {
        [k: string]: string;
    };
};

export type TStringTranslation = string | React.ReactElement<TLocalizeProps>;

// ref: https://www.carlrippon.com/react-children-with-typescript/
export type TReactChildren = React.ReactNode;
