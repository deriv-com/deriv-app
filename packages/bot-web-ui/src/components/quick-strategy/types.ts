export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TValidationType = 'min' | 'max' | 'required' | 'number' | 'ceil' | 'floor' | 'text-number';

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
    regex: RegExp;
}>;

export type TConfigItem = {
    type: string;
} & TPartialConfigItem;

export type TStrategy = {
    name: string;
    label: string;
    description: string;
    fields: TConfigItem[][];
};

export type TStrategies = {
    [key: string]: TStrategy;
};
