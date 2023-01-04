import { routes } from '@deriv/shared';
import { TRootStore } from 'Types';
import AccountPromptDialogStore from '../account-prompt-dialog-store';

describe('AccountPromptDialogStore', () => {
    let account_prompt_dialog_store: AccountPromptDialogStore;
    const root_store: DeepPartial<TRootStore> = {
        common: {
            routeTo: jest.fn(),
        },
        client: {
            accounts: {
                CR90000001: {
                    is_virtual: 0,
                    currency: 'USD',
                },
                CR90000002: {
                    is_virtual: 0,
                    currency: 'BTC',
                },
            },
            currency: 'BTC',
            switchAccount: jest.fn(),
        },
        modules: {
            cashier: {
                general_store: {
                    setIsDeposit: jest.fn(),
                },
            },
        },
    };

    beforeEach(() => {
        // TODO: Check this
        account_prompt_dialog_store = new AccountPromptDialogStore(root_store as TRootStore);
    });

    it('should show the dialog', () => {
        account_prompt_dialog_store.shouldNavigateAfterPrompt(routes.cashier_deposit, 'deposit');

        expect(account_prompt_dialog_store.last_location).toBe(routes.cashier_deposit);
        expect(account_prompt_dialog_store.should_show).toBeTruthy();
        expect(account_prompt_dialog_store.current_location).toBe('deposit');
    });

    it('should reset last_location', () => {
        account_prompt_dialog_store.resetLastLocation();

        expect(account_prompt_dialog_store.last_location).toBeNull();
    });

    it('should reset is_confirmed', () => {
        account_prompt_dialog_store.resetIsConfirmed();

        expect(account_prompt_dialog_store.is_confirmed).toBeFalsy();
    });

    it('should hide the dialog then switch to fiat account if the client is on crypto account upon confirm', async () => {
        account_prompt_dialog_store.shouldNavigateAfterPrompt(routes.cashier_deposit, 'deposit');
        await account_prompt_dialog_store.onConfirm();

        expect(account_prompt_dialog_store.should_show).toBeFalsy();
        expect(account_prompt_dialog_store.is_confirmed).toBeTruthy();
        expect(account_prompt_dialog_store.root_store.client.switchAccount).toHaveBeenCalledWith('CR90000001');
        expect(account_prompt_dialog_store.root_store.modules.cashier.general_store.setIsDeposit).toHaveBeenCalledWith(
            true
        );

        account_prompt_dialog_store.continueRoute();
        expect(account_prompt_dialog_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
    });

    it('should hide the dialog then stay on page if the client is on fiat account upon confirm', async () => {
        account_prompt_dialog_store.root_store.client.currency = 'USD';

        account_prompt_dialog_store.shouldNavigateAfterPrompt(routes.cashier_deposit, 'deposit');
        await account_prompt_dialog_store.onConfirm();

        expect(account_prompt_dialog_store.should_show).toBeFalsy();
        expect(account_prompt_dialog_store.is_confirmed).toBeTruthy();
        expect(account_prompt_dialog_store.root_store.client.switchAccount).not.toHaveBeenCalled();
    });

    it('should hide the dialog on cancel', () => {
        account_prompt_dialog_store.onCancel();

        expect(account_prompt_dialog_store.should_show).toBeFalsy();
    });
});
