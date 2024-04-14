import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TPreferredCountriesModalFooterProps = {
    is_disabled: boolean;
    onClear: () => void;
    onApply: () => void;
};

const PreferredCountriesModalFooter = ({ is_disabled, onClear, onApply }: TPreferredCountriesModalFooterProps) => {
    return (
        <>
            <Button large onClick={onClear} secondary>
                <Localize i18n_default_text='Clear' />
            </Button>
            <Button disabled={is_disabled} primary large onClick={onApply}>
                <Localize i18n_default_text='Apply' />
            </Button>
        </>
    );
};

export default PreferredCountriesModalFooter;
