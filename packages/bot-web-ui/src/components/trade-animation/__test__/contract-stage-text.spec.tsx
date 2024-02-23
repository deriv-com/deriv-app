import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import { contract_stages } from 'Constants/contract-stage';
import ContractStageText from '../contract-stage-text';

describe('ContractStageText', () => {
    it('should render <ContractStageText /> correct text for each contract stage', () => {
        const stages = Object.keys(contract_stages);
        stages.forEach(stage => {
            render(<ContractStageText contract_stage={contract_stages[stage as keyof typeof contract_stages]} />);
            switch (stage) {
                case 'NOT_RUNNING':
                    expect(screen.getByText('Bot is not running')).toBeInTheDocument();
                    break;
                case 'STARTING':
                    expect(screen.getByText('Bot is starting')).toBeInTheDocument();
                    break;
                case 'PURCHASE_SENT':
                    expect(screen.getByText('Buying contract')).toBeInTheDocument();
                    break;
                case 'PURCHASE_RECEIVED':
                    expect(screen.getByText('Contract bought')).toBeInTheDocument();
                    break;
                case 'IS_STOPPING':
                    expect(screen.getByText('Bot is stopping')).toBeInTheDocument();
                    break;
                case 'CONTRACT_CLOSED':
                    expect(screen.getByText('Contract closed')).toBeInTheDocument();
                    break;
                default:
                    expect(screen.getByText('Bot is not running')).toBeInTheDocument();
            }
        });
    });
});
