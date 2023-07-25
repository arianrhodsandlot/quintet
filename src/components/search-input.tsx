import { useRouter } from 'next/router'
import { type ChangeEvent, type CompositionEvent, type Ref, useEffect, useRef, useState } from 'react'
import { TextField, type TextFieldProps, classNames } from 'rmwc'
import { sites } from '../lib/constants'

type ExtractRef<T extends Ref<any>> = T extends Ref<infer P> ? P : never
type MDCTextFieldFoundation = ExtractRef<NonNullable<TextFieldProps['foundationRef']>>

export function SearchInput() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const textFieldRef = useRef<MDCTextFieldFoundation>(null)
  const [isCompositionStart, setIsCompositionStart] = useState(false)

  const isHome = router.pathname === '/'

  function search(query: string) {
    if (query) {
      router.replace({
        pathname: '/search',
        query: {
          site: router.query.site ?? localStorage.getItem('site') ?? sites[0].site,
          query,
        },
      })
    } else {
      router.replace('/')
    }
  }

  function onCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    setIsCompositionStart(false)
    const query = event.currentTarget.value.trim()
    search(query)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (isCompositionStart) {
      return
    }
    const query = event.currentTarget.value.trim()
    search(query)
  }

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
    if (textFieldRef?.current) {
      textFieldRef.current.activateFocus()
      textFieldRef.current.autoCompleteFocus()
    }
  }

  useEffect(() => {
    focusInput()
  }, [])

  useEffect(() => {
    if (!router.query.query) {
      textFieldRef.current?.setValue('')
      focusInput()
    }
  }, [router.query.query])

  return (
    <div
      className={classNames('mt-10 flex items-center justify-center transition-[height]', {
        'h-[calc(100vh-300px)]': isHome,
        'h-14': !isHome,
      })}
    >
      <TextField
        className='w-[56rem]'
        defaultValue={router.query?.query ? `${router.query.query}` : ''}
        foundationRef={textFieldRef}
        icon='label_important'
        id='query'
        inputRef={inputRef}
        name='album-query'
        onChange={onChange}
        onCompositionEnd={onCompositionEnd}
        onCompositionStart={() => {
          setIsCompositionStart(true)
        }}
        outlined
      />
    </div>
  )
}
