import React from 'react';
import { DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper } from '../Base';
import './WalletsErrorMT5InvestorPassword.scss';

type TProps = {
    actionButtons?: React.ComponentProps<typeof ActionScreen>['actionButtons'];
    errorMessage: string;
    title: string;
};

const WalletsErrorMT5InvestorPassword: React.FC<TProps> = ({ actionButtons, errorMessage, title }) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    return (
        <ModalStepWrapper
            renderFooter={isMobile ? () => actionButtons : undefined}
            shouldHideFooter={!isMobile}
            title={localize('Reset {{title}} password', { title })}
        >
            <div className='wallets-error-mt5-investor-password'>
                <ActionScreen
                    actionButtons={!isMobile ? actionButtons : undefined}
                    description={errorMessage}
                    icon={<DerivLightIcDxtradePasswordIcon height={100} width={100} />}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletsErrorMT5InvestorPassword;
