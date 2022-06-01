/* -------------------------------------------------------------------------- */
/* PAYMENT AGENT TYPES                                                        */
/* -------------------------------------------------------------------------- */

export type PaymentAgentProps = {
    container?: string;
    is_cashier_locked?: boolean;
    is_payment_agent_withdraw?: boolean;
    is_virtual?: boolean;
    is_switching?: boolean;
    payment_agent_active_tab_index?: number;
    setActiveTab?: (container: string | undefined) => void;
    setPaymentAgentActiveTabIndex?: (index: number) => void;
    verification_code?: string;
};

// TODO: Change RootStore type from any to something appropriate
export type RootStore = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client?: any;
    modules: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cashier: any;
    };
};
