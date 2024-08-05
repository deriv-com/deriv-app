import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';

export type TBarrierHeader = {
    current_index: number;
    onPrevClick?: () => void;
    onNextClick?: () => void;
    title?: React.ReactNode;
};

const BarrierHeader = ({ current_index, onPrevClick, title }: TBarrierHeader) => (
    <ActionSheet.Header
        className={current_index ? 'barrier-params__description-header' : ''}
        title={title}
        icon={!current_index && <LabelPairedCircleInfoMdRegularIcon data-testid='info-icon' onClick={onPrevClick} />}
        iconPosition='right'
    />
);

export default BarrierHeader;
