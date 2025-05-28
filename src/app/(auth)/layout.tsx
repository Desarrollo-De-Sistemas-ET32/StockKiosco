import React from 'react'

const AuthLa = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='container'>{children}</div>
  )
}

export default AuthLa