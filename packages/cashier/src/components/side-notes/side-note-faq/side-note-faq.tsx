import React, { useMemo } from 'react';

import { Accordion, SideNote, StaticUrl, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { Chat } from '@deriv/utils';
import { useDevice } from '@deriv-com/ui';

import './side-note-faq.scss';

type TSideNoteFAQProps = {
    transaction_type?: 'deposit' | 'withdraw';
};

const SideNoteFAQ = ({ transaction_type }: TSideNoteFAQProps) => {
    const { client } = useStore();
    const { isMobile } = useDevice();
    const { is_eu } = client;

    const onClickHandler = () => Chat.open();

    const deposit_faq_list = useMemo(() => {
        return [
            {
                header: localize('How can I confirm that my deposit was successful in my Deriv account?'),
                content: (
                    <Localize
                        i18n_default_text='Deposits are usually processed immediately. If you don’t see the funds after 24 hours, contact us via <0>live chat</0> with your transaction details (amount, date, and time), and we’ll sort it out quickly for you.'
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('Can I keep depositing if I reach my limit?'),
                content: (
                    <Localize
                        i18n_default_text='The deposit limit resets within 1–2 hours. We recommend updating your browser and using incognito mode. If the issue persists, please contact us via <0>live chat</0>.'
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('What steps can I take if my payment method isn’t working?'),
                content: (
                    <>
                        <Localize i18n_default_text='Here are some common card/e-wallet errors and their solutions:' />
                        <ol className='side-note-faq__accordion-list'>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Insufficient balance:</0> Please ensure you have sufficient funds in your card or e-wallet. If the problem persists, please contact your bank for help.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>3D secure invalid/redirected:</0> Please contact your bank for an OTP.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Restricted card:</0> Please use a locally issued card. '
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Transaction declined by bank:</0> Please contact your bank for further assistance.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text as='li' size='xxs'>
                                <Localize
                                    i18n_default_text='<0>Customer cancelled payment:</0> Please try again after 1 hour.'
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </ol>
                    </>
                ),
            },
            {
                header: localize("Can I use someone else's payment method?"),
                content: (
                    <Localize
                        i18n_default_text='To keep your account safe, we only support payment methods registered under your name. Using someone else’s payment method can lead to account restrictions for both parties.<1/><1/>If you think your payment method was used without your permission, please contact us via <0>live chat</0> with proof of ownership. We’re here to help.'
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                            <br key={1} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('How do I check if my deposit method also supports withdrawals?'),
                content: (
                    <Localize i18n_default_text='You can check if a payment method supports withdrawals on the deposit page. If it shows "Withdrawal: N/A," that means withdrawals aren’t available for that method, so you’ll need to choose a different deposit method that allows both deposits and withdrawals.' />
                ),
            },
        ];
    }, []);

    const withdraw_faq_list = useMemo(() => {
        return [
            {
                header: localize("Why can't I see the funds on my card/e-wallet balance after I've made a withdrawal?"),
                content: (
                    <Localize i18n_default_text="Your withdrawal will be processed internally in one business day. After that, for debit/credit cards, it takes 1-15 working days, and for e-wallets, it's 1-3 working days. If there's a delay beyond these periods, please contact us via live chat." />
                ),
            },
            {
                header: localize("Why can't I use a payment agent to withdraw my funds?"),
                content: (
                    <Localize
                        i18n_default_text='If you have used a different payment method to make your deposit, you cannot withdraw via a payment agent. However, if you have used both a payment agent and another payment method (for example, an e-wallet) to deposit, you have to withdraw via the e-wallet first up to your original deposited amount. After that, you can use a payment agent to make a withdrawal. If your original payment method is not available for withdrawals, please let us know through <0>live chat</0> for assistance.'
                        components={[
                            <span key={0} className='link' onClick={onClickHandler} onKeyDown={onClickHandler} />,
                        ]}
                    />
                ),
            },
            {
                header: localize('How do I cancel my withdrawal?'),
                content: (
                    <Localize i18n_default_text="Withdrawals can be cancelled if they're still in the 'Requested' status (you can check your status under Pending payout). Once the status changes to 'Authorised', in 'Progress', or 'Processed', cancellation isn't possible." />
                ),
            },
            {
                header: localize('Can I withdraw using a different method?'),
                content: (
                    <Localize i18n_default_text='No, withdrawals must be made using the same method you used for your deposit.' />
                ),
            },
            {
                header: localize('How long does it take to receive my withdrawal?'),
                content: (
                    <Localize
                        i18n_default_text='We usually process withdrawal requests within 24 hours. The time it takes for the funds to reach your account depends on the payment method you choose.<0/><0/>After we’ve processed your withdrawal request, it may take up to 5 working days for the amount to appear in your account balance.'
                        components={[<br key={0} />]}
                    />
                ),
            },
        ];
    }, []);

    return (
        <SideNote
            description={
                <Text size={!isMobile ? 'xs' : 'xxs'} weight='bold'>
                    <Localize i18n_default_text='FAQ' />
                </Text>
            }
        >
            {transaction_type === 'deposit' && (
                <Accordion
                    className='side-note-faq__accordion'
                    icon_close='IcChevronDown'
                    icon_open='IcCashierChevronUp'
                    list={deposit_faq_list}
                />
            )}
            {transaction_type === 'withdraw' && (
                <Accordion
                    className='side-note-faq__accordion'
                    icon_close='IcChevronDown'
                    icon_open='IcCashierChevronUp'
                    list={withdraw_faq_list}
                />
            )}
            <Text size='xxs'>
                <Localize
                    i18n_default_text='<0>View more</0>'
                    components={[
                        <StaticUrl key={0} className='link' href='help-centre' is_document={false} is_eu_url={is_eu} />,
                    ]}
                />
            </Text>
        </SideNote>
    );
};

export default SideNoteFAQ;
