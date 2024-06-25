import React, { useState } from 'react';
import { FormikValues, useFormikContext } from 'formik';
import {
    EmploymentStatusField,
    TaxIdentificationNumberField,
    TaxResidenceField,
} from '../Components/forms/form-fields';
import { isFieldImmutable } from '../Helpers/utils';
import { Checkbox, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getLegalEntityName } from '@deriv/shared';

type TEmploymentTaxDetailsContainerProps = {
    editable_fields: string[];
    should_close_tooltip: boolean;
    setShouldCloseTooltip: (should_close_tooltip: boolean) => void;
};

const EmploymentTaxDetailsContainer = ({
    editable_fields,
    should_close_tooltip,
    setShouldCloseTooltip,
}: TEmploymentTaxDetailsContainerProps) => {
    const { values, setFieldValue, touched, errors } = useFormikContext<FormikValues>();

    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = useState(false);

    const tax_residence_ref = React.useRef<HTMLDivElement>(null);
    const tin_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (target.tagName === 'A') {
            event?.stopPropagation();
            return false;
        }
        return !tax_residence_ref.current?.contains(target) && !tin_ref.current?.contains(target);
    };

    useOnClickOutside(tax_residence_ref, () => setIsTaxResidencePopoverOpen(false), validateClickOutside);
    useOnClickOutside(tin_ref, () => setIsTinPopoverOpen(false), validateClickOutside);

    React.useEffect(() => {
        if (should_close_tooltip) {
            setIsTaxResidencePopoverOpen(false);
            setIsTinPopoverOpen(false);
            setShouldCloseTooltip(false);
        }
    }, [should_close_tooltip, setShouldCloseTooltip]);

    return (
        <div>
            {'employment_status' in values && (
                <EmploymentStatusField required is_disabled={isFieldImmutable('employment_status', editable_fields)} />
            )}
            {'tax_residence' in values && (
                <div ref={tax_residence_ref}>
                    <TaxResidenceField
                        disabled={isFieldImmutable('tax_residence', editable_fields)}
                        is_tax_residence_popover_open={is_tax_residence_popover_open}
                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                    />
                </div>
            )}

            {'tax_identification_number' in values && (
                <div ref={tin_ref}>
                    <TaxIdentificationNumberField
                        disabled={isFieldImmutable('tax_identification_number', editable_fields)}
                        is_tin_popover_open={is_tin_popover_open}
                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                    />
                </div>
            )}
            {'tax_identification_confirm' in values && (
                <Checkbox
                    name='tax_identification_confirm'
                    className='details-form__tin-confirm'
                    data-lpignore
                    onChange={() =>
                        setFieldValue('tax_identification_confirm', !values.tax_identification_confirm, true)
                    }
                    value={values.tax_identification_confirm}
                    label={localize(
                        'I hereby confirm that the tax information I provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                        {
                            legal_entity_name: getLegalEntityName('maltainvest'),
                        }
                    )}
                    withTabIndex={0}
                    data-testid='tax_identification_confirm'
                    has_error={!!(touched.tax_identification_confirm && errors.tax_identification_confirm)}
                />
            )}
        </div>
    );
};

export default EmploymentTaxDetailsContainer;
