import { popover_zindex } from 'Constants/z-indexes';

export type TCommonInputsProperties = {
    className?: string;
    zIndex?: number;
};

const common_inputs_properties: Readonly<TCommonInputsProperties> = {
    className: 'quick-strategy__input',
    zIndex: popover_zindex.QUICK_STRATEGY,
};

export default common_inputs_properties;
