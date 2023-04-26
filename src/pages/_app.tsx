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
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <TopBar />
      <SearchInput />
      {isHome || <SearchOptions />}
      <Component {...pageProps} />
    </>
  )
}
