import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Page = {
  data: {
    url: string;
    title: string;
    description: string;
    ts: number;
    id: string;
  }[];
  after: string;
};

export default function Home(): JSX.Element {
  async function loadImages({ pageParam = null }): Promise<Page> {
    const { data: apiData } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return apiData;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', loadImages, {
    getNextPageParam: lastPage => lastPage?.after || null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(d => d.data.flat());
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            my="6"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
