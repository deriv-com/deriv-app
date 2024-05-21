import React from 'react';
import { Localize } from '@deriv/translations';
import { Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import useClosedPositions from 'AppV2/Hooks/useClosedPositions';
import { filterPositions } from '../../Utils/positions-utils';
import PositionsContent from './positions-content';

type TPositionsProps = {
    onRedirectToTrade?: () => void;
};

export type TClosedPositions = ReturnType<typeof useClosedPositions>['closedPositions'];

// TODO: Temporary loader, will be replaced
const Loader = () => <div style={{ fontSize: '25px' }}>Loader</div>;

const Positions = observer(({ onRedirectToTrade }: TPositionsProps) => {
    // TODO: refactor this hook for date filtration. e.g. date_from and date_to
    const { closedPositions, isLoading } = useClosedPositions();

    const [contractTypeFilter, setContractTypeFilter] = React.useState<string[]>([]);
    const [filteredPositions, setFilteredPositions] = React.useState<TClosedPositions>(closedPositions);
    const [noMatchesFound, setNoMatchesFound] = React.useState(false);

    const tabs = [
        {
            id: 'open',
            title: <Localize i18n_default_text='Open' />,
            content: (
                <PositionsContent
                    noMatchesFound={noMatchesFound}
                    onRedirectToTrade={onRedirectToTrade}
                    // TODO: Refactor hook or create new one for Open positions
                    positions={[]}
                    setContractTypeFilter={setContractTypeFilter}
                    contractTypeFilter={contractTypeFilter}
                />
            ),
        },
        {
            id: 'closed',
            title: <Localize i18n_default_text='Closed' />,
            content: (
                <PositionsContent
                    isClosedTab
                    noMatchesFound={noMatchesFound}
                    positions={filteredPositions}
                    setContractTypeFilter={setContractTypeFilter}
                    contractTypeFilter={contractTypeFilter}
                />
            ),
        },
    ];

    React.useEffect(() => {
        if (contractTypeFilter.length) {
            const result = filterPositions(closedPositions, contractTypeFilter);
            setNoMatchesFound(!result.length);
            setFilteredPositions(result);
        } else setFilteredPositions(closedPositions);
    }, [contractTypeFilter]);

    React.useEffect(() => {
        if (!isLoading) setFilteredPositions(closedPositions);
    }, [closedPositions]);

    return (
        <div className='positions-page'>
            <Tab.Container contentStyle='fill' size='md' className='positions-page__tabs'>
                <Tab.List>
                    {tabs.map(({ id, title }) => (
                        <Tab.Trigger key={id}>{title}</Tab.Trigger>
                    ))}
                </Tab.List>
                <Tab.Content className='positions-page__tabs-content'>
                    {isLoading ? <Loader /> : tabs.map(({ id, content }) => <Tab.Panel key={id}>{content}</Tab.Panel>)}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
});

export default Positions;
