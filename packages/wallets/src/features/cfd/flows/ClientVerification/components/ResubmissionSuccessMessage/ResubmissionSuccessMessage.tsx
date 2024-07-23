import React from 'react';
import { DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import './ResubmissionSuccessMessage.scss';

type TResubmissionSuccessMessageProps = {
    message: string;
    onCompletion?: () => void;
};

const ResubmissionSuccessMessage: React.FC<TResubmissionSuccessMessageProps> = ({ message, onCompletion }) => {
    const ActionButton = () => {
        return <Button onClick={onCompletion}>Ok</Button>;
    };

    return (
        <ModalStepWrapper title='Add a real MT5 account'>
            <div className='wallets-resubmission-message'>
                <ActionScreen
                    actionButtons={<ActionButton />}
                    description={message}
                    icon={<DerivLightWaitingPoiIcon height={128} width={128} />}
                    title='Your documents were submitted successfully'
                />
            </div>
        </ModalStepWrapper>
    );
};

export default ResubmissionSuccessMessage;
