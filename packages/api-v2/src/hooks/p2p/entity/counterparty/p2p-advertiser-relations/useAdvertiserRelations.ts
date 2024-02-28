import useInvalidateQuery from '../../../../../useInvalidateQuery';
import useMutation from '../../../../../useMutation';
import useQuery from '../../../../../useQuery';
import useAuthorize from '../../../../useAuthorize';

/** This hook returns favourite and blocked advertisers and the mutation function to update the block list of the current user. */
const useAdvertiserRelations = () => {
    const { isSuccess } = useAuthorize();
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useQuery('p2p_advertiser_relations', { options: { enabled: isSuccess } });
    const { mutate, ...mutate_rest } = useMutation('p2p_advertiser_relations', {
        onSuccess: () => {
            invalidate('p2p_advertiser_relations');
            invalidate('p2p_advertiser_list');
        },
    });

    const advertiser_relations = data?.p2p_advertiser_relations;

    return {
        /** P2P advertiser relations information. */
        data: advertiser_relations,
        /** Blocked advertisers by the current user. */
        blocked_advertisers: advertiser_relations?.blocked_advertisers,
        /** Favourite advertisers of the current user. */
        favourite_advertisers: advertiser_relations?.favourite_advertisers,

        /** The mutation function to update (add/remove) the currrent user's block list.  */
        mutate,
        /** The mutation related information. */
        mutation: mutate_rest,
        ...rest,
    };
};

export default useAdvertiserRelations;
