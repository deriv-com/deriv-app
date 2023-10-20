// import axios from 'axios';
import { useQuery as _useQuery } from '@tanstack/react-query';
import { GraphQLClient, gql } from 'graphql-request';

type TVideoParams = any;

// export const instance = axios.create({
//     baseURL: process.env.STRAPI_API_URL,
//     headers: {
//         'content-type': 'application/json',
//         Authorization: `bearer ${process.env.STRAPI_TOKEN}`,
//     },
//     withCredentials: true,
// });

const endpoint = process.env.STRAPI_API_URL as string;

const client = new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
});

const GraphQLInstance = {
    getDtraderVideo(params: TVideoParams = {}) {
        const query = gql`
            {
                strapiDtraderVideo {
                    dtrader_video
                }
            }
        `;
        // const { is_dark_theme = '', is_mobile = '', trade_type = '' } = params;
        return _useQuery({
            queryKey: ['video'],
            queryFn: () => client.request<Blob>(query),
        });
    },
};

export default GraphQLInstance;
