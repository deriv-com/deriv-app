import { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type ModalId =
    | 'AccountSelector'
    | 'AddOrManageAccount'
    | 'ChangePassword'
    | 'CTraderSuccessModal'
    | 'DummyComponentModal'
    | 'DxtradePasswordModal'
    | 'GetADerivAccountDialog'
    | 'InvalidInputModal'
    | 'JurisdictionModal'
    | 'MT5AccountTypeModal'
    | 'MT5PasswordModal'
    | 'RealAccountCreation'
    | 'RegulationModal'
    | 'SentEmailContentModal'
    | 'TopUpModal'
    | 'TradeModal'
    | 'VerificationFailedModal';

/**
 * @description A hook to manage query params for modals
 * @returns isOpen: (modalId: ModalId) => boolean
 * @returns openModal: (modalId: string) => void
 * @returns closeModal: () => void
 * @returns queryParams: URLSearchParams
 * @example
 * const { isOpen, openModal, closeModal, queryParams } = useQueryParams();
 * const isModalOpen = isOpen('GetADerivAccountDialog');
 * openModal('GetADerivAccountDialog');
 * closeModal();
 */
const useQueryParams = () => {
    const { search } = useLocation();
    const history = useHistory();

    const queryParams = useMemo(() => new URLSearchParams(search), [search]);

    const isModalOpen = useCallback((modalId: ModalId) => queryParams.get('modal') === modalId, [queryParams]);

    const openModal = useCallback(
        (modalId: string, state: Record<string, unknown> = {}) => {
            queryParams.set('modal', modalId);
            history.push({
                pathname: history.location.pathname,
                search: queryParams.toString(),
                state: { modal: modalId, ...state },
            });
        },
        [queryParams, history]
    );

    const closeModal = useCallback(() => {
        queryParams.delete('modal');
        history.push({
            pathname: history.location.pathname,
            search: queryParams.toString(),
        });
    }, [queryParams, history]);

    useEffect(() => {
        if (history.action === 'POP') {
            closeModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        isModalOpen,
        openModal,
        closeModal,
        queryParams,
    };
};

export default useQueryParams;
