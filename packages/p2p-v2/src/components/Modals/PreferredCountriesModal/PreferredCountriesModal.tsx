import React, { useState } from 'react';
import { FullPageMobileWrapper } from '@/components/FullPageMobileWrapper';
import { Modal, Text, useDevice } from '@deriv-com/ui';
import { PreferredCountriesDropdown } from './PreferredCountriesDropdown';
import { PreferredCountriesFooter } from './PreferredCountriesFooter';
import './PreferredCountriesModal.scss';

type TPreferredCountriesModalProps = {
    countryList: { text: string; value: string }[];
    isModalOpen: boolean;
    onClickApply: () => void;
    onRequestClose: () => void;
    selectedCountries: string[];
    setSelectedCountries: (value: string[]) => void;
};

const PreferredCountriesModal = ({
    countryList,
    isModalOpen,
    onClickApply,
    onRequestClose,
    selectedCountries,
    setSelectedCountries,
}: TPreferredCountriesModalProps) => {
    const { isMobile } = useDevice();
    const [shouldDisplayFooter, setShouldDisplayFooter] = useState(true);

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-preferred-countries-modal__full-page-modal'
                onBack={onRequestClose}
                renderFooter={
                    shouldDisplayFooter
                        ? () => (
                              <PreferredCountriesFooter
                                  isDisabled={selectedCountries.length === 0}
                                  onClickApply={onClickApply}
                                  onClickClear={() => setSelectedCountries([])}
                              />
                          )
                        : undefined
                }
                renderHeader={() => <Text weight='bold'>Preferred countries</Text>}
            >
                <PreferredCountriesDropdown
                    list={countryList}
                    selectedCountries={selectedCountries}
                    setSelectedCountries={setSelectedCountries}
                    setShouldDisplayFooter={setShouldDisplayFooter}
                />
            </FullPageMobileWrapper>
        );
    }
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-preferred-countries-modal__dialog'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header onRequestClose={onRequestClose}>
                <Text weight='bold'>Preferred countries</Text>
            </Modal.Header>
            <Modal.Body>
                <PreferredCountriesDropdown
                    list={countryList}
                    selectedCountries={selectedCountries}
                    setSelectedCountries={setSelectedCountries}
                    setShouldDisplayFooter={setShouldDisplayFooter}
                />
            </Modal.Body>
            {shouldDisplayFooter && (
                <Modal.Footer>
                    <PreferredCountriesFooter
                        isDisabled={selectedCountries?.length === 0}
                        onClickApply={onClickApply}
                        onClickClear={() => setSelectedCountries([])}
                    />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default PreferredCountriesModal;
