import Head from 'next/head'
import { useRouter } from 'next/router'
import { SearchResult } from '@/components/search-result'

export default function Search() {
  const router = useRouter()

  const query = router.query.query ? `${router.query.query}`.trim() : ''

  return (
    <>
      <Head>
        <title>{query ? `${query} - Quintet` : 'Quintet'}</title>
      </Head>
      <SearchResult />
    </>
  )
}
