import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CFDPOA, { TCFDPOAProps } from '../Components/cfd-poa';
import CFDPOI from '../Components/cfd-poi';
import { LandingCompany, ResidenceList, GetSettings, StatesList, GetAccountStatus } from '@deriv/api-types';
import RootStore from 'Stores/index';

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TStoreProofOfAddressArgs = {
    file_uploader_ref: HTMLDivElement | null;
    values: { [key: string]: string };
};

type TRemoveNotificationMessage = {
    key: string;
    should_show_again: boolean;
};

type TGetSettings = GetSettings & {
    upload_file?: string;
    poi_state?: string;
};

type TCFDFinancialStpRealAccountSignupProps = {
    addNotificationByKey: (key: string) => void;
    authentication_status: TAuthenticationStatus;
    get_settings: TGetSettings;
    client_email: string;
    is_fully_authenticated: boolean;
    landing_company: LandingCompany;
    openPendingDialog: () => void;
    refreshNotifications: () => void;
    removeNotificationMessage: () => void;
    removeNotificationByKey: (args: TRemoveNotificationMessage) => void;
    residence_list: ResidenceList;
    states_list: StatesList;
    storeProofOfAddress: TStoreProofOfAddressArgs;
    fetchStatesList: () => void;
    account_status: GetAccountStatus;
    onFinish: () => void;
};

type TSetSubmiting = (isSubmitting: boolean) => void;

type TNextStep = (submitting: TSetSubmiting) => void;

type TItemsState = {
    header: { [key: string]: string };
    body: ({ onSave, index, onSubmit, refreshNotifications, ...props }: TCFDPOAProps) => JSX.Element;
    form_value: { [key: string]: string | undefined };
    forwarded_props: Array<Partial<keyof TCFDFinancialStpRealAccountSignupProps>>;
};

const CFDFinancialStpRealAccountSignup = (props: TCFDFinancialStpRealAccountSignupProps) => {
    const { refreshNotifications, authentication_status, fetchStatesList } = props;
    const [step, setStep] = React.useState<number>(0);
    const [form_error, setFormError] = React.useState<string>('');

    const poi_config: TItemsState = {
        header: {
            active_title: localize('Complete your proof of identity'),
            title: localize('Proof of identity'),
        },
        body: CFDPOI,
        form_value: {
            poi_state: 'unknown',
        },
        forwarded_props: [
            'addNotificationByKey',
            'authentication_status',
            'refreshNotifications',
            'removeNotificationMessage',
            'removeNotificationByKey',
        ],
    };

    const poa_config: TItemsState = {
        header: {
            active_title: localize('Complete your proof of address'),
            title: localize('Proof of address'),
        },
        body: CFDPOA,
        form_value: {
            address_line_1: props.get_settings.address_line_1,
            address_line_2: props.get_settings.address_line_2,
            address_city: props.get_settings.address_city,
            address_state: props.get_settings.address_state,
            address_postcode: props.get_settings.address_postcode,
            upload_file: '',
        },
        forwarded_props: ['states_list', 'get_settings', 'storeProofOfAddress', 'refreshNotifications'],
    };

    const should_show_poi = !(
        authentication_status.identity_status === 'pending' || authentication_status.identity_status === 'verified'
    );
    const should_show_poa = !(
        authentication_status.document_status === 'pending' || authentication_status.document_status === 'verified'
    );
    const verification_configs = [...(should_show_poi ? [poi_config] : []), ...(should_show_poa ? [poa_config] : [])];

    const [items, setItems] = React.useState<TItemsState[]>(verification_configs);

    const state_index = step;

    const clearError = () => {
        setFormError('');
    };

    const nextStep: TNextStep = async () => {
        clearError();
        if (step + 1 < items.length) {
            setStep(step + 1);
        } else {
            props.onFinish();
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setFormError('');
    };
    const updateValue = async (
        index: number,
        value: { [key: string]: string | undefined },
        setSubmitting: TSetSubmiting
    ) => {
        saveFormData(index, value);
        nextStep(setSubmitting);
    };

    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);

    React.useEffect(() => {
        fetchStatesList();
    }, [fetchStatesList]);

    const getCurrent = (key?: keyof TItemsState) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const saveFormData = (index: number, value: { [key: string]: string | undefined }) => {
        const cloned_items: TItemsState[] = [...items];
        cloned_items[index].form_value = value;
        setItems(cloned_items);
    };
    const BodyComponent = getCurrent('body') as React.FunctionComponent<any>;
    const form_value = getCurrent('form_value');

    const passthrough = ((getCurrent('forwarded_props') || []) as TItemsState['forwarded_props']).reduce(
        (forwarded_prop, item) => {
            return Object.assign(forwarded_prop, {
                [item]: props[item],
            });
        },
        {}
    );
    const height = 'auto';

    return (
        <Div100vhContainer
            className='cfd-financial-stp-modal'
            id='real_mt5_financial_stp_account_opening'
            is_disabled={isDesktop()}
            height_offset='40px'
        >
            <div className='cfd-financial-stp-modal__body'>
                <BodyComponent
                    value={form_value}
                    index={state_index}
                    onSubmit={updateValue}
                    height={height}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    form_error={form_error}
                    {...passthrough}
                />
            </div>
        </Div100vhContainer>
    );
};

export default connect(({ client, modules: { cfd }, notifications }: RootStore) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    get_settings: client.account_settings,
    client_email: client.email,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    openPendingDialog: cfd.openPendingDialog,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchStatesList: client.fetchStatesList,
    storeProofOfAddress: cfd.storeProofOfAddress,
    account_status: client.account_status,
}))(CFDFinancialStpRealAccountSignup);
