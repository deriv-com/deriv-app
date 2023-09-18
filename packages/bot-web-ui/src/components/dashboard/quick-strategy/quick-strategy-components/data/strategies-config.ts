import { localize } from '@deriv/translations';
import dalembert_data_fields from './dalembert-data-fields';
import martingale_data_fields from './martingale-data-fields';
import oscars_grind_data_fields from './oscars-grind-data-fields';
import { DAlembertSchemaFields, MartingaleSchemaFields, OscarsGrindSchemaFields } from './schema-validation';

const strategies = {
    martingale: {
        index: 0,
        label: localize('Martingale'),
        value: 'martingale',
        fields: martingale_data_fields,
        validation_schema: MartingaleSchemaFields,
    },
    dalembert: {
        index: 1,
        label: localize("D'Alembert"),
        value: 'dalembert',
        fields: dalembert_data_fields,
        validation_schema: DAlembertSchemaFields,
    },
    oscars_grind: {
        index: 2,
        label: localize("Oscar's Grind"),
        value: 'oscars_grind',
        fields: oscars_grind_data_fields,
        validation_schema: OscarsGrindSchemaFields,
    },
};

export default strategies;
