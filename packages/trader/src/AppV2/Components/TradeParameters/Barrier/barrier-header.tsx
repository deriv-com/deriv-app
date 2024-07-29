import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

export type TBarrierHeader = {
    current_index: number;
    onPrevClick: () => void;
};

const BarrierHeader = ({ current_index, onPrevClick }: TBarrierHeader) => (
    <ActionSheet.Header
        className={current_index ? 'barrier-params__description-header' : ''}
        title={<Localize i18n_default_text='Barrier' />}
        icon={!current_index && <LabelPairedCircleInfoMdRegularIcon onClick={onPrevClick} />}
        iconPosition={'right'}
    />
);

export default BarrierHeader;
