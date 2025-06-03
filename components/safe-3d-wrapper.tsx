import type React from "react"
import { Suspense } from "react"
import { ErrorBoundary } from "./error-boundary"

interface Safe3DWrapperProps {
  children: React.ReactNode
}

const Safe3DWrapper: React.FC<Safe3DWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the 3D scene.</div>}>
      <Suspense fallback={<div>Loading 3D scene...</div>}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default Safe3DWrapper
