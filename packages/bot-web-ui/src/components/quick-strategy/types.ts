export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    symbol?: string;
    tradetype?: string;
    durationtype?: string;
    duration?: string;
    stake?: string;
    size?: string;
    profit?: string;
    loss?: string;
    unit?: string;
    action: string;
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

export type TConfigItem = {
    type: string;
    name?: keyof TFormData;
    fullWidth?: boolean;
    dependencies?: string[];
    label?: string;
    description?: string;
    attached?: boolean;
    hide?: string[];
    validation?: TValidationItem[];
};

export type TStrategy = {
    name: string;
    label: string;
    description: string;
    fields: TConfigItem[][];
};

export type TStrategies = {
    [key: string]: TStrategy;
};
