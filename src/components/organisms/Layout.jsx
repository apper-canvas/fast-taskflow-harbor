import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;