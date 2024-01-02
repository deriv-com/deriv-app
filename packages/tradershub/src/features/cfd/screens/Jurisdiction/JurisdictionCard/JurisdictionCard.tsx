import React, { MouseEvent, useMemo, useState } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
import { useModal } from '../../../../../components/ModalProvider';
import { StaticLink } from '../../../../../components/StaticLink';
import DocumentsIcon from '../../../../../public/images/ic-documents.svg';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import { useDynamicLeverageModalState } from '../../../components/DynamicLeverageContext';
import { getJurisdictionContents } from '../jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardItems, TJurisdictionCardSection } from '../jurisdiction-contents/props.types';
import {
    JurisdictionCardClass,
    JurisdictionCardClassProps,
    JurisdictionCardTagClass,
    JurisdictionCardTagProps,
} from './JurisdictionCard.classnames';
import JurisdictionCardBack from './JurisdictionCardBack';
import JurisdictionCardRow from './JurisdictionCardRow';
import JurisdictionCardTag from './JurisdictionCardTag';
import JurisdictionCardVerificationTag from './JurisdictionCardVerificationTag';

type TJurisdictionCardProps = JurisdictionCardClassProps & {
    jurisdiction: string;
    onSelect: (clickedJurisdiction: string) => void;
    tag?: string;
};

type TDisplayTextSkinColor = JurisdictionCardTagProps['displayTextSkinColor'];

type TVerificationDocumentsMapper = {
    [key: string]: {
        category: 'poa' | 'poi' | null;
        icon?: JSX.Element;
    };
};

const verificationDocumentsMapper: TVerificationDocumentsMapper = {
    documentNumber: {
        category: 'poi',
        icon: <IdCardIcon />,
    },
    nameAndAddress: {
        category: 'poa',
        icon: <DocumentsIcon />,
    },
    notApplicable: {
        category: null,
    },
    selfie: {
        category: 'poi',
        icon: <SelfieIcon />,
    },
};

const JurisdictionCard = ({
    isAdded = false,
    isSelected = false,
    jurisdiction = 'svg',
    onSelect,
}: TJurisdictionCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { toggleDynamicLeverage } = useDynamicLeverageModalState();
    const { getModalState } = useModal();

    const descriptionClickHandler = (tag?: TJurisdictionCardProps['tag']) => (event: MouseEvent) => {
        event.stopPropagation();
        if (tag === 'dynamicLeverage') {
            toggleDynamicLeverage();
        } else {
            setIsFlipped(true);
        }
    };

    const { contents, header, isOverHeaderAvailable, overHeader, verificationDocs } = useMemo<TJurisdictionCardItems>(
        () => getJurisdictionContents()[jurisdiction],
        [jurisdiction]
    );
    const marketType = getModalState('marketType') || 'all';
    const rows = contents[marketType] || [];

    const parseDescription = (row: TJurisdictionCardSection) => {
        if (row.clickableDescription)
            return row.clickableDescription.map(description => {
                if (description.type === 'link') {
                    return (
                        <StaticLink
                            className='text-brand-red-light '
                            key={`jurisdiction-card-description-${description.text}`}
                            onClick={descriptionClickHandler(description.tag)}
                            size='md'
                        >
                            {description.text}
                        </StaticLink>
                    );
                }
                return description.text;
            });
        return row.description;
    };

    const parseTag = (row: TJurisdictionCardSection) =>
        row?.titleIndicators?.displayText && (
            <div
                className={JurisdictionCardTagClass({
                    displayTextSkinColor: row?.titleIndicators
                        ?.displayTextSkinColor as unknown as TDisplayTextSkinColor,
                })}
            >
                <Text bold className='leading-[1] text-system-light-primary-background' size='sm'>
                    {row?.titleIndicators.displayText}
                </Text>
            </div>
        );

    return (
        <div
            className={qtMerge(JurisdictionCardClass({ isAdded, isFlipped, isSelected }))}
            onClick={() => {
                !isAdded && onSelect(jurisdiction);
            }}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    !isAdded && onSelect(jurisdiction);
                }
            }}
        >
            <div className='flex flex-col justify-center w-full h-full transition-transform duration-300 px-800 pt-1000 pb-1800 backface-hidden transform-gpu'>
                {isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
                <div className='mt-[25px] mb-[15px] text-center'>
                    <Text bold className='text-system-light-primary-background' size='lg'>
                        {header}
                    </Text>
                </div>
                <div className='border-sm border-system-light-secondary-background'>
                    {rows.map(row => (
                        <JurisdictionCardRow
                            description={parseDescription(row)}
                            key={`wallets-jurisdiction-card--${row?.title}`}
                            renderTag={() => {
                                if (!row?.titleIndicators) return;

                                if (
                                    row.titleIndicators?.type === 'displayIcons' &&
                                    verificationDocs &&
                                    marketType &&
                                    marketType !== 'all'
                                ) {
                                    return (
                                        <div className='flex gap-300'>
                                            {!(marketType in verificationDocs)
                                                ? verificationDocumentsMapper.notApplicable.icon
                                                : verificationDocs[marketType]?.map(doc => (
                                                      <JurisdictionCardVerificationTag
                                                          category={verificationDocumentsMapper[doc].category}
                                                          icon={verificationDocumentsMapper[doc].icon}
                                                          key={`verification-doc-${doc}`}
                                                      />
                                                  ))}
                                        </div>
                                    );
                                }
                                if (row.titleIndicators.displayText) {
                                    return parseTag(row);
                                }
                            }}
                            title={row.title}
                        />
                    ))}
                </div>
                {isAdded && (
                    <div className='absolute w-full text-center rounded-b-[13px] rounded-t-50 bottom-50 left-50 p-400 bg-random-blue'>
                        <Text bold className='text-system-light-primary-background' size='sm'>
                            Added
                        </Text>
                    </div>
                )}
            </div>
            {marketType && marketType !== 'all' && verificationDocs && (
                <JurisdictionCardBack setIsFlipped={setIsFlipped} verificationDocs={verificationDocs[marketType]} />
            )}
        </div>
    );
};

export default JurisdictionCard;
