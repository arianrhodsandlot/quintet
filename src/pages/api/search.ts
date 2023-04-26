import { type NextRequest } from 'next/server'
import { sites } from '../../lib/constants'
import { search } from '../../lib/searcher'

export const config = {
  runtime: 'edge',
}

function makeResponseJson(object: unknown) {
  return new Response(JSON.stringify(object))
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site') ?? ''
  const query = searchParams.get('query') ?? ''

  if (!site || !query) {
    return makeResponseJson([])
  }

  if (!sites.some((allowedSite) => site === allowedSite.site)) {
    return makeResponseJson([])
  }

  try {
    const result = await search(site, query)
    return makeResponseJson(result)
  } catch (error) {
    console.error(error)
    return makeResponseJson([])
  }
}
