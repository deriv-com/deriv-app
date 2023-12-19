export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TValidationType = 'min' | 'max' | 'required' | 'number' | 'ceil' | 'floor';

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
    fullWidth: boolean;
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

type TPartialDescriptionItem = Partial<{
    content: string[];
    src: string;
    alt: string;
    className: string;
    expanded: boolean;
    no_collapsible: boolean;
}>;

export type TDescriptionItem = {
    type: string;
} & TPartialDescriptionItem;

export type TDataGroupedObjectsByTitle = {
    type: string;
    content: string[];
};

export type TDescription = TDescriptionItem[] | TDataGroupedObjectsByTitle;

export type TStrategy = {
    name: string;
    label: string;
    description: string;
    long_description?: TDescriptionItem[];
    fields: TConfigItem[][];
};

export type TStrategies = {
    [key: string]: TStrategy;
};
