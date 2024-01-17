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

export type TStrategyDescription = {
    item: TDescriptionItem;
    font_size: string;
};

export type TConfigItem = Partial<{
    type: string;
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
        multiple?: Array<string>;
    }[];
    hide_without_should_have: boolean;
}>;

export type TDescriptionItem = Partial<{
    type: string;
    content: string[];
    src: string;
    alt: string;
    className: string;
    expanded: boolean;
    no_collapsible: boolean;
    font_size: string;
    id: number;
    dark_src?: string;
    styles?: { [key: string]: string };
}>;
export type TDescription = TDescriptionItem[] | TDescriptionItem[][];

export type TStrategy = {
    name: string;
    label: string;
    description: TDescriptionItem[];
    fields: TConfigItem[][];
};

export type TStrategies = {
    [key: string]: TStrategy;
};
