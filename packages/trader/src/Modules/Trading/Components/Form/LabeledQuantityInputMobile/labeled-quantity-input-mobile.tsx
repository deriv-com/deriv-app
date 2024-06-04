import React from 'react';
import { InputField } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';

type TLabeledQuantityInputMobile = {
    input_label: string | React.ReactNode;
    wrapper_classname?: string;
    name?: string;
} & React.ComponentProps<typeof InputField>;

const LabeledQuantityInputMobile = ({ input_label, ...props }: TLabeledQuantityInputMobile) => (
    <div className={`${props.name}__widget ${props.wrapper_classname}`} data-testid={`dt_${props.name}_widget`}>
        <Fieldset className={`${props.name}__fields`}>
            <InputField {...props} />
        </Fieldset>
        <h2 className={`${props.name}__widget-title`}>{input_label}</h2>
    </div>
);

export default React.memo(LabeledQuantityInputMobile);
