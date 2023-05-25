import React from 'react';
import PropTypes from 'prop-types';
import { InputField } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';

const LabeledQuantityInputMobile = ({ input_label, ...props }) => (
    <div
        className={`${props.name}__widget ${props.wrapper_classname && props.wrapper_classname}`}
        data-testid={`dt_${props.name}_widget`}
    >
        <Fieldset className={`${props.name}__fields`}>
            <InputField {...props} />
        </Fieldset>
        <h2 className={`${props.name}__widget-title`}>{input_label}</h2>
    </div>
);

LabeledQuantityInputMobile.propTypes = {
    input_label: PropTypes.string,
    ...InputField.propTypes,
};

export default React.memo(LabeledQuantityInputMobile);
