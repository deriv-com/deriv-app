import useQuery from '../../useQuery';
import useAuthorize from '../useAuthorize';

/** This hook returns favourite and blocked advertisers of the current user. */
const useAdvertiserRelations = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_advertiser_relations', { options: { enabled: isSuccess } });
    const advertiser_relations = data?.p2p_advertiser_relations;

    return {
        data: advertiser_relations,
        /** List of advertisers blocked by the current user. */
        blocked_advertisers: advertiser_relations?.blocked_advertisers,
        /** Favourite advertisers of the current user. */
        favourite_advertisers: advertiser_relations?.favourite_advertisers,
        ...rest,
    };
};

export default useAdvertiserRelations;
