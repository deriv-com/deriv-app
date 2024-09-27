import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { LabelPairedPresentationScreenSmRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_LIST, getContractTypesList } from 'AppV2/Utils/trade-types-utils';
import GuideDefinitionModal from './guide-definition-modal';
import GuideDescriptionModal from './guide-description-modal';

type TGuide = {
    has_label?: boolean;
    show_guide_for_selected_contract?: boolean;
};

const Guide = observer(({ has_label, show_guide_for_selected_contract }: TGuide) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();
    const { contract_type, is_vanilla } = useTraderStore();
    const contract_type_title = is_vanilla ? CONTRACT_LIST.VANILLAS : getContractTypesList()[contract_type];

    const [is_description_opened, setIsDescriptionOpened] = React.useState(false);
    const [selected_contract_type, setSelectedContractType] = React.useState(
        show_guide_for_selected_contract ? contract_type_title : CONTRACT_LIST.RISE_FALL
    );
    const [selected_term, setSelectedTerm] = React.useState<string>('');

    const onChipSelect = React.useCallback((id: string) => setSelectedContractType(id ?? ''), []);

    const onClose = React.useCallback(() => setIsDescriptionOpened(false), []);

    React.useEffect(() => {
        if (show_guide_for_selected_contract) setSelectedContractType(contract_type_title);
    }, [show_guide_for_selected_contract, contract_type_title]);

    return (
        <React.Fragment>
            <Button
                color={is_dark_mode_on ? 'white' : 'black'}
                icon={<LabelPairedPresentationScreenSmRegularIcon key='guide-button-icon' />}
                onClick={() => setIsDescriptionOpened(true)}
                variant={has_label ? 'secondary' : 'tertiary'}
            >
                {has_label && (
                    <Text size='sm' bold color='quill-typography__color--prominent'>
                        <Localize i18n_default_text='Guide' />
                    </Text>
                )}
            </Button>
            <GuideDescriptionModal
                is_open={is_description_opened}
                is_dark_mode_on={is_dark_mode_on}
                onClose={onClose}
                onChipSelect={onChipSelect}
                onTermClick={setSelectedTerm}
                selected_contract_type={selected_contract_type}
                show_guide_for_selected_contract={show_guide_for_selected_contract}
            />
            <GuideDefinitionModal
                contract_type={selected_contract_type}
                term={selected_term}
                onClose={() => setSelectedTerm('')}
            />
        </React.Fragment>
    );
});

export default Guide;
