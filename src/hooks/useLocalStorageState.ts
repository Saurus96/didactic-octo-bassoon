import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorageState<T>(
  initializer: () => T,
  saver: (value: T) => void,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initializer)

  useEffect(() => {
    saver(state)
  }, [saver, state])

  return [state, setState]
}
