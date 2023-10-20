import { GraphQLInstance } from '@deriv/api';

const useDTraderVideo = () => {
    const { data, error, isFetching } = GraphQLInstance.getDtraderVideo();
    return {
        /** The video response. */
        data,
        error,
        isFetching,
    };
};

export default useDTraderVideo;
