import React from 'react';
import { DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './ResubmissionSuccessMessage.scss';

type TResubmissionSuccessMessageProps = {
    message: string;
    onCompletion?: () => void;
};

const ResubmissionSuccessMessage: React.FC<TResubmissionSuccessMessageProps> = ({ message, onCompletion }) => {
    const { localize } = useTranslations();

    return (
        <ModalStepWrapper title={localize('Add a real MT5 account')}>
            <div className='wallets-resubmission-message'>
                <ActionScreen
                    actionButtons={
                        <Button onClick={onCompletion}>
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    }
                    description={message}
                    icon={<DerivLightWaitingPoiIcon height={128} width={128} />}
                    title={localize('Your documents were submitted successfully')}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default ResubmissionSuccessMessage;
