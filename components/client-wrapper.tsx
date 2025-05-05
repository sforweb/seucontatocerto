\"use client"

import React, { useState, useEffect } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Ou um loader, se preferir
  }

  return <>{children}</>;
};

export default ClientWrapper;