import {
    intercept,
    spy }        from 'mobx';
import Validator from '../validator';

const validate = (dvrs) => (target, key) => {
    const handler = (store, property, change) => {
        const validator = new Validator(
            { [property]: change.newValue },
            store.validation_rules
        );

        if (validator.passes()) {
            store.validation_errors[property] = [];
            return change;
        }

        store.setValidationErrorMessages(property, validator.errors.get(property));

        return change;
    };

    const spyDisposer = spy(({ type, object: store, key: property }) => {
        if (type !== 'add') {
            return;
        }

        if (key && property !== key) {
            return;
        }

        if (!Object.isPrototypeOf.call(target, store)) {
            return;
        }

        store.setDVR(key, dvrs);
        intercept(store, key, handler.bind(null, store, key));
        spyDisposer();
    });
};

export default validate;
