import React, { useEffect, useState } from 'react';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { p2p } from '@deriv/api-v2';
import { LabelPairedChevronRightLgRegularIcon } from '@deriv/quill-icons';
import { Modal, Text, ToggleSwitch, useDevice } from '@deriv-com/ui';
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

    const sortedSelectedPaymentMethods = [...selectedPaymentMethods].sort((a, b) => a.localeCompare(b));
    const sortedPaymentMethods = [...paymentMethods].sort((a, b) => a.localeCompare(b));
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
        if (data && paymentMethods.length > 0) {
            const selectedPaymentMethodsDisplayName = data
                .filter(paymentMethod => paymentMethods.includes(paymentMethod.id))
                .map(paymentMethod => paymentMethod.display_name);

            setPaymentMethodNames(selectedPaymentMethodsDisplayName.join(', '));
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
        <Modal ariaHideApp={false} className='p2p-v2-filter-modal' isOpen={isModalOpen} onRequestClose={onRequestClose}>
            <Modal.Header className='border-2' onRequestClose={onRequestClose}>
                <PageReturn
                    onClick={() => setShowPaymentMethods(false)}
                    pageTitle={headerText}
                    shouldHideBackButton={!showPaymentMethods}
                    weight='bold'
                />
            </Modal.Header>
            <Modal.Body>
                <FilterModalContent
                    filterOptions={filterOptions}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    showPaymentMethods={showPaymentMethods}
                />
            </Modal.Body>
            <Modal.Footer className='p-0'>
                <FilterModalFooter
                    hasSameFilters={hasSameFilters}
                    hasSamePaymentMethods={hasSamePaymentMethods}
                    onApplyConfirm={onApplyConfirm}
                    onResetClear={onResetClear}
                    paymentMethods={paymentMethods}
                    showPaymentMethods={showPaymentMethods}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default FilterModal;
