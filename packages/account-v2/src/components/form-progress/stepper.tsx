import React from "react";
import { StandaloneCheckBoldIcon } from "@deriv/quill-icons";
import StepConnector from "./step-connector";

export type TStep = { title: string; isFilled: boolean };

type TStepperProps = {
  isActive: boolean;
  step: TStep;
  stepCount: number;
};

const Stepper = ({ isActive, step, stepCount }: TStepperProps) => (
  <div>
    <div>
      {stepCount !== 0 && <StepConnector isActive={isActive} />}
      <span>{step.isFilled ? <StandaloneCheckBoldIcon /> : null}</span>
    </div>
  </div>
);

export default Stepper;
