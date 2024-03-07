import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { p2p } from '@deriv/api-v2';
import { LabelPairedChevronRightLgRegularIcon, LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { Text, ToggleSwitch, useDevice } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import { FilterModalContent } from './FilterModalContent';
import { FilterModalFooter } from './FilterModalFooter';
import './FilterModal.scss';

type TFilterModalProps = {
    isModalOpen: boolean;
    isToggled: boolean;
    onRequestClose: () => void;
    onToggle: (value: boolean) => void;
    selectedPaymentMethods: string[];
    setSelectedPaymentMethods: (value: string[]) => void;
};

const FilterModal = ({
    isModalOpen,
    isToggled,
    onRequestClose,
    onToggle,
    selectedPaymentMethods,
    setSelectedPaymentMethods,
}: TFilterModalProps) => {
    const { data } = p2p.paymentMethods.useGet();
    const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
    const [isMatching, setIsMatching] = useState<boolean>(isToggled);
    const [paymentMethods, setPaymentMethods] = useState<string[]>(selectedPaymentMethods);
    const [paymentMethodNames, setPaymentMethodNames] = useState<string>('All');
    const { isMobile } = useDevice();

    const filterOptions = [
        {
            component: <LabelPairedChevronRightLgRegularIcon />,
            onClick: () => setShowPaymentMethods(true),
            subtext: paymentMethodNames,
            text: 'Payment methods',
        },
        {
            component: <ToggleSwitch onChange={event => setIsMatching(event.target.checked)} value={isMatching} />,
            subtext: 'Ads that match your Deriv P2P balance and limit.',
            text: 'Matching ads',
        },
    ];

    const sortedSelectedPaymentMethods = [...selectedPaymentMethods].sort();
    const sortedPaymentMethods = [...paymentMethods].sort();
    const hasSamePaymentMethods = JSON.stringify(sortedSelectedPaymentMethods) === JSON.stringify(sortedPaymentMethods);
    const hasSameMatching = isToggled === isMatching;
    const hasSameFilters = hasSamePaymentMethods && hasSameMatching;
    const headerText = showPaymentMethods ? 'Payment methods' : 'Filter';

    const onApplyConfirm = () => {
        if (showPaymentMethods) {
            setShowPaymentMethods(false);
        } else {
            setSelectedPaymentMethods(paymentMethods);
            onToggle(isMatching);
            onRequestClose();
        }
    };

    const onResetClear = () => {
        setPaymentMethods([]);
        if (!showPaymentMethods) {
            setIsMatching(true);
        }
    };

    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);

    useEffect(() => {
        if (data && paymentMethods.length > 0) {
            const filteredPaymentMethods = data
                .filter(paymentMethod => paymentMethods.includes(paymentMethod.id))
                .map(paymentMethod => paymentMethod.display_name);

            setPaymentMethodNames(filteredPaymentMethods.join(', '));
        } else if (paymentMethods.length === 0) {
            setPaymentMethodNames('All');
        }
    }, [data, paymentMethods]);

    if (isMobile && isModalOpen) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-filter-modal'
                onBack={showPaymentMethods ? () => setShowPaymentMethods(false) : onRequestClose}
                renderFooter={() => (
                    <FilterModalFooter
                        hasSameFilters={hasSameFilters}
                        hasSamePaymentMethods={hasSamePaymentMethods}
                        onApplyConfirm={onApplyConfirm}
                        onResetClear={onResetClear}
                        paymentMethods={paymentMethods}
                        showPaymentMethods={showPaymentMethods}
                    />
                )}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        {headerText}
                    </Text>
                )}
            >
                <FilterModalContent
                    filterOptions={filterOptions}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    showPaymentMethods={showPaymentMethods}
                />
            </FullPageMobileWrapper>
        );
    }

    return (
        <ReactModal
            className='p2p-v2-filter-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            <PageReturn
                className='py-6 px-8 m-0'
                hasBorder
                hideBackButton={!showPaymentMethods}
                onClick={() => setShowPaymentMethods(false)}
                pageTitle={headerText}
                rightPlaceHolder={<LabelPairedXmarkLgBoldIcon className='cursor-pointer' onClick={onRequestClose} />}
                weight='bold'
            />
            <FilterModalContent
                filterOptions={filterOptions}
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
                showPaymentMethods={showPaymentMethods}
            />
            <FilterModalFooter
                hasSameFilters={hasSameFilters}
                hasSamePaymentMethods={hasSamePaymentMethods}
                onApplyConfirm={onApplyConfirm}
                onResetClear={onResetClear}
                paymentMethods={paymentMethods}
                showPaymentMethods={showPaymentMethods}
            />
        </ReactModal>
    );
};

export default FilterModal;
