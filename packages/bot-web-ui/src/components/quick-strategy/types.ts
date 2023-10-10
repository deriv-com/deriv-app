export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    symbol?: string;
    trade_type?: string;
    duration_unit?: string;
    duration_value?: number;
    stake?: number;
    size?: number;
    profit_threshold?: number;
    loss_threshold?: number;
    unit?: number;
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
