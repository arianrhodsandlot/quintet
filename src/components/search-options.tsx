import { useRouter } from 'next/router'
import { Chip, type ChipOnInteractionEventT, ChipSet } from 'rmwc'
import { sites } from '../lib/constants'

export function SearchOptions() {
  const router = useRouter()

  function onInteraction(e: ChipOnInteractionEventT) {
    const site = e.detail.chipId
    router.replace({
      pathname: '/search',
      query: {
        ...router.query,
        site,
      },
    })
    localStorage.setItem('site', site)
  }

  function isSelected(site: string) {
    return router.query.site === site
  }

  return (
    <ChipSet choice className='mx-auto mt-5 flex w-[58rem] flex-wrap justify-center'>
      {sites.map((site) => (
        <Chip
          className='text-xs'
          icon={isSelected(site.site) ? 'done' : 'radio_button_unchecked'}
          label={site.name}
          id={site.site}
          key={site.site}
          onInteraction={onInteraction}
        />
      ))}
    </ChipSet>
  )
}
