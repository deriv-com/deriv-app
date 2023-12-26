export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TValidationType = 'min' | 'max' | 'required' | 'number' | 'ceil' | 'floor' | 'integer';

export interface ValidationObject {
    getMessage: (min: number | string) => string;
}

export type TValidationItem =
    | TValidationType
    | ({
          type: TValidationType;
          value: number | string;
      } & ValidationObject);

type TPartialConfigItem = Partial<{
    name: keyof TFormData;
    dependencies: string[];
    label: string;
    description: string;
    attached: boolean;
    hide: string[];
    validation: TValidationItem[];
    should_have: {
        key: string;
        value: string | number | boolean;
    }[];
}>;

export type TConfigItem = {
    type: string;
} & TPartialConfigItem;

export type TDataGroupedObjectsByTitle = {
    type: string;
    content: string[];
};

type TPartialDescriptionItem = Partial<{
    type: string;
    content: string[];
    src: string;
    alt: string;
    className: string;
    expanded: boolean;
    no_collapsible: boolean;
    font_size: string;
}>;

export type TDescriptionItem = {
    item: TDataGroupedObjectsByTitle & {
        className: string;
        src?: string;
        alt?: string;
    };
} & TPartialDescriptionItem;

export type TDescription = TDescriptionItem[] | TDataGroupedObjectsByTitle;

export type TStrategy = {
    name: string;
    label: string;
    description: TDescriptionItem[];
    fields: TConfigItem[][];
};

export type TStrategies = {
    [key: string]: TStrategy;
};
