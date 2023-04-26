import ky, { type Options } from 'ky'
import useSWR from 'swr'

interface SearchApiParams {
  site: string
  query: string
}

type SearchApiResponse = {
  src: string
  refer: string
  title: string
}[]

function search(options: Options) {
  return ky('/api/search', options).json<SearchApiResponse>()
}

export function useSearch({ site, query }: SearchApiParams) {
  return useSWR({ searchParams: { site, query } }, search, {
    keepPreviousData: true,
  })
}
