import React from 'react';

const AuthLa = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md p-8 max-w-md w-full border border-gray-300">
        {children}
      </div>
    </div>
  );
};

export default AuthLa;
