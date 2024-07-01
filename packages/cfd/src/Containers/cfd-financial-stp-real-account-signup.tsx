import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Div100vhContainer } from '@deriv/components';
import { getAuthenticationStatusInfo, isPOARequiredForMT5 } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';
import CFDPOA from '../Components/cfd-poa';
import CFDPOI from '../Components/cfd-poi';
import CFDPersonalDetailsContainer from './cfd-personal-details-container';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { JURISDICTION } from '../Helpers/cfd-config';

type TCFDFinancialStpRealAccountSignupProps = {
    onFinish: () => void;
};

type TNextStep = (index: number, value: { [key: string]: string | undefined }) => void;

type TItem = {
    refreshNotifications: TCoreStores['notifications']['refreshNotifications'];
    removeNotificationMessage: TCoreStores['notifications']['removeNotificationMessage'];
    removeNotificationByKey: TCoreStores['notifications']['removeNotificationByKey'];
    addNotificationMessageByKey: TCoreStores['notifications']['addNotificationMessageByKey'];
    authentication_status: TCoreStores['client']['authentication_status'];
    account_settings: TCoreStores['client']['account_settings'];
    email: TCoreStores['client']['email'];
    is_fully_authenticated: TCoreStores['client']['is_fully_authenticated'];
    landing_company: TCoreStores['client']['landing_company'];
    residence_list: TCoreStores['client']['residence_list'];
    states_list: TCoreStores['client']['states_list'];
    fetchStatesList: TCoreStores['client']['fetchStatesList'];
    account_status: TCoreStores['client']['account_status'];
    jurisdiction_selected_shortcode: TCoreStores['modules']['cfd']['jurisdiction_selected_shortcode'];
    has_submitted_cfd_personal_details: TCoreStores['modules']['cfd']['has_submitted_cfd_personal_details'];
    onFinish: TCFDFinancialStpRealAccountSignupProps['onFinish'];
};

type TItemsState<T extends TItem> = {
    body: typeof CFDPOI | typeof CFDPOA | typeof CFDPersonalDetailsContainer;
    form_value: { [key: string]: string | undefined };
    forwarded_props: Array<Partial<keyof T>>;
};

const CFDFinancialStpRealAccountSignup = observer(({ onFinish }: TCFDFinancialStpRealAccountSignupProps) => {
    const { isDesktop } = useDevice();
    const { notifications, client } = useStore();

    const { refreshNotifications, removeNotificationMessage, removeNotificationByKey, addNotificationMessageByKey } =
        notifications;

    const {
        authentication_status,
        account_settings,
        email,
        is_fully_authenticated,
        landing_company,
        residence_list,
        states_list,
        fetchStatesList,
        account_status,
    } = client;

    const { jurisdiction_selected_shortcode, has_submitted_cfd_personal_details } = useCfdStore();

    const passthroughProps = {
        refreshNotifications,
        removeNotificationMessage,
        removeNotificationByKey,
        addNotificationMessageByKey,
        authentication_status,
        account_settings,
        email,
        is_fully_authenticated,
        landing_company,
        residence_list,
        states_list,
        fetchStatesList,
        account_status,
        jurisdiction_selected_shortcode,
        has_submitted_cfd_personal_details,
        onFinish,
    } as const;

    const [step, setStep] = React.useState(0);
    const [form_error, setFormError] = React.useState('');
    const state_index = step;
    let is_mounted = React.useRef(true).current;

    const { need_poi_for_maltainvest, need_poi_for_bvi_labuan_vanuatu } = getAuthenticationStatusInfo(account_status);

    const poi_config: TItemsState<typeof passthroughProps> = {
        body: CFDPOI,
        form_value: {
            poi_state: 'unknown',
        },
        forwarded_props: [
            'addNotificationMessageByKey',
            'authentication_status',
            'refreshNotifications',
            'removeNotificationMessage',
            'removeNotificationByKey',
            'jurisdiction_selected_shortcode',
        ],
    };

    const poa_config: TItemsState<typeof passthroughProps> = {
        body: CFDPOA,
        form_value: {},
        forwarded_props: [],
    };

    const personal_details_config: TItemsState<typeof passthroughProps> = {
        body: CFDPersonalDetailsContainer,
        form_value: {
            citizen: '',
            place_of_birth: '',
            tax_residence: '',
            tax_identification_number: '',
            account_opening_reason: '',
        },
        forwarded_props: ['residence_list', 'landing_company'],
    };

    const should_show_poi = () => {
        if (jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST) {
            return need_poi_for_maltainvest;
        }
        return need_poi_for_bvi_labuan_vanuatu;
    };

    const shouldShowPOA = () => {
        return isPOARequiredForMT5(account_status, jurisdiction_selected_shortcode);
    };

    const should_show_personal_details =
        !has_submitted_cfd_personal_details && jurisdiction_selected_shortcode !== JURISDICTION.MALTA_INVEST;

    const verification_configs = [
        ...(should_show_poi() ? [poi_config] : []),
        ...(shouldShowPOA() ? [poa_config] : []),
        ...(should_show_personal_details ? [personal_details_config] : []),
    ];

    const [items, setItems] = React.useState<TItemsState<typeof passthroughProps>[]>(verification_configs);

    const clearError = () => {
        setFormError('');
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    React.useEffect(() => {
        fetchStatesList();
    }, [fetchStatesList]);

    const unmount = () => {
        is_mounted = false;
        onFinish();
    };

    const saveFormData = (index: number, value: { [key: string]: string | undefined }) => {
        if (!is_mounted) return; // avoiding state update on unmounted component
        const cloned_items: TItemsState<typeof passthroughProps>[] = [...items];
        cloned_items[index].form_value = value;
        setItems(cloned_items);
    };

    const nextStep: TNextStep = (index, value) => {
        clearError();
        if (step + 1 < items.length) {
            saveFormData(index, value);
            setStep(step + 1);
        } else unmount();
    };

    const prevStep = () => {
        if (step - 1 >= 0) {
            setStep(step - 1);
            setFormError('');
        } else unmount();
    };

    const getCurrent = (key?: keyof TItemsState<typeof passthroughProps>) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const BodyComponent = getCurrent('body') as typeof CFDPOI & typeof CFDPOA & typeof CFDPersonalDetailsContainer;

    const form_value = getCurrent('form_value');

    const passthrough: Partial<TCFDFinancialStpRealAccountSignupProps> = (
        (getCurrent('forwarded_props') || []) as TItemsState<typeof passthroughProps>['forwarded_props']
    ).reduce((forwarded_prop, item) => {
        return Object.assign(forwarded_prop, {
            [item]: passthroughProps[item],
        });
    }, {});

    return (
        <Div100vhContainer
            className='cfd-financial-stp-modal'
            id='real_mt5_financial_stp_account_opening'
            is_disabled={isDesktop}
            height_offset='40px'
        >
            <div className='cfd-financial-stp-modal__body' data-testid='dt_cfd_financial_stp_modal_body'>
                <BodyComponent
                    /** TODO: Body component is 3 different component in which one of them does not have prop `value`
                     * it needs a refactor
                     */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={form_value}
                    index={state_index}
                    onSubmit={nextStep}
                    height='auto'
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                    {...passthrough}
                />
            </div>
        </Div100vhContainer>
    );
});

export default CFDFinancialStpRealAccountSignup;
