import { popover_zindex } from 'Constants/z-indexes';

export type TCommonInputsProperties = {
    label_className?: string;
    field_className?: string;
    className?: string;
    zIndex?: number;
};

const common_inputs_properties: Readonly<TCommonInputsProperties> = {
    label_className: 'quick-strategy__input-label',
    field_className: 'quick-strategy__input-field',
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};

export default common_inputs_properties;
