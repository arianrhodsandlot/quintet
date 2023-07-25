import './globals.sass'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SearchInput } from '../components/search-input'
import { SearchOptions } from '../components/search-options'
import { TopBar } from '../components/top-bar'

export default function App({ Component, pageProps }: any) {
  const router = useRouter()

  const isHome = router.pathname === '/'

  return (
    <>
      <Head>
        <link href='/favicon.png' rel='shortcut icon' />
      </Head>
      <TopBar />
      <SearchInput />
      {isHome || <SearchOptions />}
      <Component {...pageProps} />
      <a
        className='github-fork-ribbon right-top color-[#333] origin-top-right scale-75 before:bg-white before:content-[""] after:text-[#333]  after:content-[attr(data-ribbon)]'
        data-ribbon='Star me on GitHub'
        href='https://github.com/arianrhodsandlot/quintet'
        rel='noreferrer'
        target='_blank'
        title='Star me on GitHub'
      >
        Star me on GitHub
      </a>
    </>
  )
}
