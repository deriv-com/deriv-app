import React from 'react';
import { Button } from '@deriv-com/quill-ui';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import GuideDefinitionModal from './guide-definition-modal';
import GuideDescriptionModal from './guide-description-modal';

type TGuide = {
    has_label?: boolean;
};

const Guide = ({ has_label = false }: TGuide) => {
    const [is_description_opened, setIsDescriptionOpened] = React.useState(false);
    const [selected_contract_type, setSelectedContractType] = React.useState(CONTRACT_LIST.RISE_FALL);
    const [selected_term, setSelectedTerm] = React.useState<string>();

    const onChipSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedContractType((e.target as EventTarget & HTMLButtonElement).textContent ?? '');
    };

    return (
        <React.Fragment>
            <Button
                color='black'
                icon={<LabelPairedPresentationScreenSmRegularIcon />}
                label={has_label ? <Localize i18n_default_text='Guide' /> : ''}
                onClick={() => setIsDescriptionOpened(true)}
                variant={has_label ? 'secondary' : 'tertiary'}
            />
            <GuideDescriptionModal
                is_open={is_description_opened}
                onClose={() => setIsDescriptionOpened(false)}
                onChipSelect={onChipSelect}
                onTermClick={setSelectedTerm}
                selected_contract_type={selected_contract_type}
            />
            <GuideDefinitionModal
                contract_type={selected_contract_type}
                term={selected_term ?? ''}
                onClose={() => setSelectedTerm('')}
            />
        </React.Fragment>
    );
};

export default Guide;
