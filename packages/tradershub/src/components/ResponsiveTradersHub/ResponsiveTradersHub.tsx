import React from 'react';
import { Button, Heading, Text } from '@deriv/quill-design';
import { CTraderList } from '../../features/cfd/components/CTraderList';
import { OtherCFDPlatformsList } from '../../features/cfd/components/OtherCFDPlatformsList';
import { OptionsAndMultipliersHeading } from '../OptionsAndMultipliersSection/OptionsAndMultiplersHeading';
import { ContentSwitcher, OptionsAndMultipliersSection, StaticLink, TotalAssets } from '..';

const ResponsiveTradersHub = () => {
    return (
        <div className='flex flex-col p-800 gap-1200'>
            <div className='flex flex-col items-start gap-1200'>
                <Heading.H3>Trader&apos;s Hub</Heading.H3>
            </div>
            <div className='flex flex-col items-center'>
                <TotalAssets />
            </div>
            <div className='flex flex-col self-stretch gap-800'>
                <ContentSwitcher>
                    <ContentSwitcher.HeaderList list={['Options & Multipliers', 'CFDs']} />
                    <ContentSwitcher.PanelContainer>
                        <ContentSwitcher.Panel>
                            <Heading.H3>
                                <OptionsAndMultipliersHeading />
                            </Heading.H3>
                        </ContentSwitcher.Panel>
                        <ContentSwitcher.Panel>
                            <Heading.H3>CFDs</Heading.H3>
                        </ContentSwitcher.Panel>
                    </ContentSwitcher.PanelContainer>
                </ContentSwitcher>
            </div>
        </div>
    );
};

export default ResponsiveTradersHub;
