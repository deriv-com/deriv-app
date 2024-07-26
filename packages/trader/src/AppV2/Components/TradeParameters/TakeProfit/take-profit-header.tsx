import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftMdRegularIcon, LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TAllowEqualsProps = {
    current_index: number;
    onNextClick: () => void;
    onPrevClick: () => void;
};

const TakeProfitHeader = ({ current_index, onNextClick, onPrevClick }: TAllowEqualsProps) => (
    <ActionSheet.Header
        title={<Localize i18n_default_text='Take profit' />}
        icon={
            current_index ? (
                <LabelPairedArrowLeftMdRegularIcon onClick={onPrevClick} />
            ) : (
                <LabelPairedCircleInfoMdRegularIcon onClick={onNextClick} />
            )
        }
        iconPosition={current_index ? 'left' : 'right'}
    />
);

export default TakeProfitHeader;
