import React from 'react';
import { DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';

type TProps = {
    errorMessage: string;
    renderButtons: JSX.Element | null;
    title: string;
};

const WalletsErrorMT5Password: React.FC<TProps> = ({ errorMessage, renderButtons, title }) => {
    const { isMobile } = useDevice();

    return (
        <ModalStepWrapper
            renderFooter={() => renderButtons}
            shouldHideFooter={!isMobile}
            title={`Manage ${title} password`}
        >
            <WalletsActionScreen
                description={errorMessage}
                icon={<DerivLightIcDxtradePasswordIcon height={100} width={100} />}
                renderButtons={() => (!isMobile ? renderButtons : null)}
            />
        </ModalStepWrapper>
    );
};

export default WalletsErrorMT5Password;
