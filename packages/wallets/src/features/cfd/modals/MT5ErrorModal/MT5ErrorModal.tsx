import React from 'react';
import { useHistory } from 'react-router-dom';
import { TSocketError } from '@deriv/api-v2/types';
import { useTranslations } from '@deriv-com/translations';
import { WalletError } from '../../../../components';

type TProps = {
    error: TSocketError<'mt5_new_account'>['error'];
    onClickHandler: () => void;
};

type TGetErrorConfigValues = {
    error: TSocketError<'mt5_new_account'>['error'];
    history: ReturnType<typeof useHistory>;
    localize: ReturnType<typeof useTranslations>['localize'];
};

const getErrorConfig = ({ error, history, localize }: TGetErrorConfigValues) => {
    switch (error.code) {
        case 'ASK_FIX_DETAILS':
            return {
                buttonText: localize('Update profile'),
                description: localize('To continue, provide the required information in the Personal details section.'),
                //@ts-expect-error need to proper type history
                onClick: () => history.push('/account/personal-details'),
                title: localize('Complete your profile'),
            };
        default:
            return {
                description: error.message ?? '',
                title: error.code ?? localize('Error'),
            };
    }
};

const MT5ErrorModal: React.FC<TProps> = ({ error, onClickHandler }) => {
    const history = useHistory();
    const { localize } = useTranslations();

    const { buttonText, description, onClick, title } = getErrorConfig({ error, history, localize });

    return (
        <WalletError
            buttonText={buttonText}
            errorMessage={description}
            onClick={onClick || onClickHandler}
            title={title}
        />
    );
};

export default MT5ErrorModal;
