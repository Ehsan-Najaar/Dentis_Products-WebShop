'use client'

const Loader = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <span className="loader"></span>
    </div>
  )
}

const Loader2 = () => {
  return (
    <div
      className="fixed top-0 right-0 bg-black/60 w-screen min-h-screen grid place-items-center z-50"
      style={{ margin: 0 }}
    >
      <span className="loader after:bg-accent"></span>
    </div>
  )
}

export { Loader, Loader2 }
