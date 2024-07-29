import {Await} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import Social from './Social';
import AnnouncementBar from './AnnouncementBar';
import BackToTop from './BackToTop';
import {useLoadScript} from '@shopify/hydrogen';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  //Klaviyo Active Onsite Tracking
  const PUBLIC_KEY = 'REDMX5'; // Replace with your Klaviyo Public API Key
  const scriptStatus = useLoadScript(
    `//static.klaviyo.com/onsite/js/klaviyo.js?company_id=${PUBLIC_KEY}`,
  );

  useEffect(() => {
    if (scriptStatus === 'done') {
      // Klaviyo script loaded successfully
      console.log('Klaviyo script loaded');
    }
  }, [scriptStatus]);

  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      {/* <SubscribePopup /> */}
      <div className="sticky top-0 z-10">
        <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
        <AnnouncementBar />
        <BackToTop />
      </div>
      <Social />
      <div className="px-2 md:px-20">
        <main>{children}</main>
      </div>
      <Suspense>
        {/* <Await resolve={footer}> */}
        <Footer />
        {/* {(footer) => <Footer menu={footer.menu} shop={header.shop} />} */}
        {/* </Await> */}
      </Suspense>
    </>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}
