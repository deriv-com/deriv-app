import React from 'react';
import { localize } from '@deriv/translations';
import ChooseProduct from 'Components/choose-product';
import { WizardContext } from '../context';

const ChooseProductStep = ({ onSubmit }: any) => {
    const context = React.useContext(WizardContext);

    const handleSubmit = (product: string) => {
        context.selected_product = product;

        if (product !== 'CFDs') onSubmit({ product }, [{ step_title: localize('App'), should_be_disabled: false }]);
    };

    return <ChooseProduct handleSubmit={handleSubmit} />;
};

export default ChooseProductStep;
