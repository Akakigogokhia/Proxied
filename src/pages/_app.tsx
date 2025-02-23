'use client';

import { AppProps } from 'next/app';
import { ApolloProvider, useMutation } from '@apollo/client';
import { CartProvider } from '../app/contexts/CartContext';
import { useEffect } from 'react';
import { REGISTER } from '../app/graphql/mutations';
import client from '../app/lib/apollo';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <TokenInitializer>
          <Component {...pageProps} />
        </TokenInitializer>
      </CartProvider>
    </ApolloProvider>
  );
}

const TokenInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [register] = useMutation(REGISTER);

  useEffect(() => {
    const token = localStorage.getItem('visitorToken');
    if (!token) {
      register()
        .then((response) => {
          const token = response.data?.register.token;
          if (token) {
            localStorage.setItem('visitorToken', token);
          }
        })
        .catch((error) => {
          console.error('Registration error:', error);
        });
    }
  }, [register]);

  return <>{children}</>;
};

export default MyApp;
