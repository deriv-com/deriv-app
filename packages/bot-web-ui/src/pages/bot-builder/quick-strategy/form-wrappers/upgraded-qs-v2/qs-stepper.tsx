import React from 'react';
import { Stepper } from '@deriv-com/quill-ui';
import { LinearProgressBar } from '@deriv-com/ui';
import { localize } from '@deriv/translations';
import { QsSteps } from './trade-constants';
import './stepper.scss';

type TQSStepper = {
    current_step: QsSteps;
    is_mobile?: boolean;
};

const QSStepper = ({ current_step, is_mobile = false }: TQSStepper) => {
    const percentage = current_step === QsSteps.StrategyCompleted ? 100 : 50;
    return is_mobile ? (
        <LinearProgressBar percentage={percentage} label='' danger_limit={101} is_loading={false} warning_limit={0} />
    ) : (
        <div className='qs-stepper'>
            <Stepper.Vertical
                currentStep={current_step}
                labels={[localize('Default'), localize('Strategy template'), localize('Trade parameters')]}
            />
        </div>
    );
};

export default QSStepper;
