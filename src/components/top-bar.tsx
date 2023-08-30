import { IM_Fell_Double_Pica as IMFellDoublePica } from 'next/font/google'
import Link from 'next/link'
import {
  Elevation,
  Icon,
  TopAppBar,
  TopAppBarFixedAdjust,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  classNames,
} from 'rmwc'

const imFellDoublePixa = IMFellDoublePica({ subsets: ['latin'], style: 'italic', weight: '400' })

export function TopBar() {
  return (
    <>
      <Elevation wrap z={3}>
        <TopAppBar>
          <TopAppBarRow>
            <TopAppBarSection alignStart>
              <TopAppBarTitle>
                <Link className={classNames(imFellDoublePixa.className, 'flex items-center text-inherit')} href='/'>
                  <Icon className='mr-2 text-4xl' icon='album' />
                  <h1 className='text-3xl'>Quintet</h1>
                </Link>
              </TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
      </Elevation>
      <TopAppBarFixedAdjust />
    </>
  )
}
