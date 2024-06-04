import React, { MouseEvent, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import DocumentsIcon from '@/assets/svgs/ic-documents.svg';
import IdCardIcon from '@/assets/svgs/ic-id-card.svg';
import SelfieIcon from '@/assets/svgs/ic-selfie.svg';
import { StaticLink } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { useDynamicLeverageModalState } from '@cfd/components';
import { MarketType } from '@cfd/constants';
import { Text } from '@deriv-com/ui';
import { getJurisdictionContents } from '../jurisdiction-contents/jurisdiction-contents';
import {
    TClickableDescription,
    TJurisdictionCardItems,
    TJurisdictionCardSection,
} from '../jurisdiction-contents/props.types';
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

const JurisdictionCard = ({ isAdded = false, isSelected = false, jurisdiction, onSelect }: TJurisdictionCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { toggleDynamicLeverage } = useDynamicLeverageModalState();
    const { cfdState } = useCFDContext();
    const { isEU } = useRegulationFlags();

    const { marketType: marketTypeState } = cfdState;

    const descriptionClickHandler = (tag?: TClickableDescription['tag']) => (event: MouseEvent) => {
        event.stopPropagation();
        if (tag === 'dynamicLeverage') {
            toggleDynamicLeverage();
        } else {
            setIsFlipped(true);
        }
    };

    const jurisdictionContents = useMemo<TJurisdictionCardItems | undefined>(
        () => getJurisdictionContents(isEU)[jurisdiction],
        [isEU, jurisdiction]
    );

    if (!jurisdictionContents) {
        return null;
    }

    const { contents, header, isOverHeaderAvailable, overHeader, verificationDocs } = jurisdictionContents;

    const marketType = marketTypeState ?? MarketType.ALL;
    const rows = contents[marketType] ?? [];

    const parseDescription = (row: TJurisdictionCardSection) => {
        if (row.clickableDescription)
            return row.clickableDescription.map(description => {
                if (description.type === 'link') {
                    return (
                        <StaticLink
                            className='py-0 pl-0 text-[14px] no-underline bg-transparent text-brand-red-light'
                            key={`jurisdiction-card-description-${description.text}`}
                            onClick={descriptionClickHandler(description.tag)}
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
                <Text className='leading-2 text-system-light-primary-background' size='sm' weight='bold'>
                    {row?.titleIndicators.displayText}
                </Text>
            </div>
        );

    return (
        <div
            className={twMerge(JurisdictionCardClass({ isAdded, isFlipped, isSelected }))}
            onClick={() => {
                !isAdded && onSelect(jurisdiction);
            }}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    !isAdded && onSelect(jurisdiction);
                }
            }}
        >
            <div className='flex flex-col justify-between w-full h-full px-16 pt-20 transition-transform duration-300 backface-hidden pb-60 transform-gpu'>
                {isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader ?? ''} />}
                <div className='mt-20 text-center'>
                    <Text size='lg' weight='bold'>
                        {header}
                    </Text>
                </div>
                <div className='flex flex-col justify-between flex-1'>
                    {rows.map(row => (
                        <JurisdictionCardRow
                            description={parseDescription(row)}
                            key={`jurisdiction-card--${row?.title}`}
                            renderTag={() => {
                                if (!row?.titleIndicators) return;

                                if (
                                    row.titleIndicators?.type === 'displayIcons' &&
                                    verificationDocs &&
                                    marketType &&
                                    marketType !== 'all'
                                ) {
                                    return (
                                        <div className='flex gap-6'>
                                            {!(marketType in verificationDocs)
                                                ? verificationDocumentsMapper.notApplicable.icon
                                                : verificationDocs[marketType]
                                                      ?.filter(doc => doc in verificationDocumentsMapper)
                                                      .map(doc => (
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
                    <div className='absolute bottom-0 left-0 w-full p-8 text-center rounded-t-none rounded-b-lg bg-brand-blue'>
                        <Text className='text-system-light-primary-background' size='sm' weight='bold'>
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
