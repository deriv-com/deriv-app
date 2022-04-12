import CardsLink from 'Components/cards-link';
import React from 'react';
import { WizardContext } from '../context';

const SelectedApp = () => {
    const { selected_app } = React.useContext(WizardContext);
    return (
        <>
            {selected_app && (
                <CardsLink
                    app_card_label='Choose an app'
                    is_linked={false}
                    app_card={selected_app}
                    should_app_card_highlight
                />
            )}
            {!selected_app && <CardsLink app_card_label='Choose an app' is_linked={false} should_app_card_highlight />}
        </>
    );
};

export default SelectedApp;
