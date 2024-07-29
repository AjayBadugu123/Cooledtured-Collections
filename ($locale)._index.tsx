import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import FeaturedCards from '~/components/FeaturedCards';
import Carousel from '~/components/Carousel';
import contactForm from '~/components/ContactForm';
import FeaturedCollections from '~/components/FeaturedCollections';
import PreOrderDisplay from '~/components/PreOrderDisplay'; //Preorder renderer
import TagOverlay from '~/components/TagOverlay';
import {CurrencyCode} from '@shopify/hydrogen-react/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

// Loader function to fetch data for the page
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  // Fetching pre-order collection data
  const preOrderData = await storefront.query(FETCH_PREORDERS_PRODUCTS_QUERY, {
    variables: {handle: 'pre-orders', first: 10},
  });
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  // Returning the fetched data
  return defer({preOrderData, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <Carousel />
      <PreOrderDisplay
        preOrderData={
          // @ts-ignore
          data.preOrderData.collection
        }
      />
      <FeaturedCollections storefrontAccessToken={''} domain={''} />
      <FeaturedCards />
      <RecommendedProducts
        products={
          // @ts-ignore
          data.recommendedProducts
        }
      />
    </div>
  );
}


const FETCH_PREORDERS_PRODUCTS_QUERY = `#graphql
  # This GraphQL query fetches data for products in a specific collection.
  query FetchCollectionByHandle($handle: String!, $first: Int!) {
    # Retrieve the collection by its handle
    collection(handle: $handle) {
      # Fetch the first 'n' products in the collection
      products(first: $first, sortKey:COLLECTION_DEFAULT) {
        edges {
          node {
            id # The unique identifier of the product
            title # The title of the product
            handle # The handle (URL-friendly identifier) of the product
            tags # The tags for the product

            # Retrieve the first image associated with the product
            images(first: 1) {
              edges {
                node {
                  transformedSrc:url # The URL of the product's image
                  altText # Alternative text for the image
                }
              }
            }

            # Fetch the price range information for the product
            priceRange {
              minVariantPrice {
                amount # The price amount
                currencyCode # The currency code (e.g., USD)
              }
            }
          }
        }
      }
    }
  }
`;

type MoneyV2 = {
  amount: string;
  currencyCode: CurrencyCode;
};

type Image = {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  images: {
    nodes: Array<Image>;
  };
};

type RecommendedProductsQuery = {
  products: {
    nodes: Array<Product>;
  };
};

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <>
      <h2>Recommended Products</h2>
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) =>
              products.nodes.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.handle}`}>
                    {/* Image Container */}
                    <div className="relative">
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <TagOverlay tags={product.tags} />
                    </div>
                  </Link>
                  <div className="p-4">
                    <h4>{product.title}</h4>
                    <small>
                      <Money data={product.priceRange.minVariantPrice} />
                    </small>
                  </div>
                </div>
              ))
            }
          </Await>
        </Suspense>
      </div>
    </>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 15, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
