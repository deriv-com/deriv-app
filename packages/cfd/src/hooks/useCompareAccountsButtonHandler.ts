import { useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';
import { TCompareAccountsCard } from '../Components/props.types';
import { TAccountCategory, TMarketType } from '../types/market-type.types';

type TTypeOfAccount = {
    category: TAccountCategory;
    type: TMarketType;
};

/**
 * This hook is used to handle the onClick event of the "Add" button in the CompareAccountsCard component.
 * @param trading_platforms - trading platforms available for the user
 * @param is_account_status_verified - account status of the user
 * @param type_of_account - type of account
 * @returns onClickAdd function
 * @example
 * const { onClickAdd } = useCompareAccountsButtonHandler(trading_platforms, is_account_status_verified, type_of_account);
 */

const useCompareAccountsButtonHandler = (
    trading_platforms: TCompareAccountsCard['trading_platforms'],
    is_account_status_verified: boolean,
    type_of_account: TTypeOfAccount
) => {
    const history = useHistory();

    const {
        traders_hub,
        ui,
        common,
        modules: { cfd },
    } = useStore();

    const { getAccount, no_CR_account, no_MF_account, is_real, is_eu_user } = traders_hub;
    const { openDerivRealAccountNeededModal } = ui;
    const { setAppstorePlatform } = common;
    const { setJurisdictionSelectedShortcode, setAccountType, enableCFDPasswordModal, toggleCFDVerificationModal } =
        cfd;

    const no_real_mf_account_eu_regulator = no_MF_account && is_eu_user && is_real;

    const no_real_cr_non_eu_regulator = no_CR_account && !is_eu_user && is_real;

    const onClickAdd = () => {
        if (no_real_cr_non_eu_regulator || no_real_mf_account_eu_regulator) {
            history.push(routes.traders_hub);
            openDerivRealAccountNeededModal();
        } else {
            setAppstorePlatform(trading_platforms.platform as string);
            if (trading_platforms.platform === CFD_PLATFORMS.MT5) {
                setJurisdictionSelectedShortcode(trading_platforms.shortcode);
                if (is_account_status_verified) {
                    setAccountType(type_of_account);
                    enableCFDPasswordModal();
                } else {
                    toggleCFDVerificationModal();
                }
            } else {
                setAccountType(type_of_account);
                getAccount();
            }
            history.push(routes.traders_hub);
        }
    };

    return { onClickAdd };
};

export default useCompareAccountsButtonHandler;
