import { IM_Fell_Double_Pica } from 'next/font/google'
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

const imFellDoublePixa = IM_Fell_Double_Pica({ subsets: ['latin'], style: 'italic', weight: '400' })

export function TopBar() {
  return (
    <>
      <Elevation z={3} wrap>
        <TopAppBar>
          <TopAppBarRow>
            <TopAppBarSection alignStart>
              <TopAppBarTitle>
                <Link href='/' className={classNames(imFellDoublePixa.className, 'flex items-center text-inherit')}>
                  <Icon icon='album' className='mr-2 text-4xl' />
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
