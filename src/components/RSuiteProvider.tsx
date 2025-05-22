import { CustomProvider } from 'rsuite'

import type { ReactNode } from 'react'

const RSuiteProvider = ({ children }: { children: ReactNode }) => {
	return <CustomProvider theme='dark'>{children}</CustomProvider>
}

export default RSuiteProvider
