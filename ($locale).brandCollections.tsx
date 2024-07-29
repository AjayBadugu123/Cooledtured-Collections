// BrandCollections.tsx
import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import type {PredictiveCollectionFragment} from 'storefrontapi.generated';
import {brandCollectionHandles} from '../CollectionConfigs/brandCollectionsConfig';

// Loader function to fetch specific brand collections
export async function loader({context}: LoaderFunctionArgs) {
  const BRAND_COLLECTIONS_QUERY = generateBrandCollectionsQuery();
  const response = await context.storefront.query(BRAND_COLLECTIONS_QUERY);
  const collections = brandCollectionHandles
    .map((handle) => response[handle.replace(/-/g, '')])
    .filter(Boolean);
  return json({collections});
}

// React component to display brand collections
export default function BrandCollections() {
  const {collections} = useLoaderData<typeof loader>();
  return (
    <div className="collections">
      <h1>Brand Collections</h1>
      <div className="grid mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-screen-3xl gap-15">
        {collections.map((collection: PredictiveCollectionFragment) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="fff-slate-800 container mx-auto p-10 col-md-4 text-center text-ellipsis mb-3 hover:opacity-80 hover:shadow-lg hover:bg-white-500 transform hover:scale-105 transition-all duration-300 "
            prefetch="intent"
          >
            {collection.image && (
              <Image
                alt={collection.image.altText || collection.title}
                aspectRatio="1/1"
                data={collection.image}
              />
            )}
            <h5>{collection.title}</h5>
          </Link>
        ))}
      </div>
    </div>
    
  );
}

// Dynamically generate GraphQL query
const generateBrandCollectionsQuery = () => {
  return `#graphql
      fragment Collection on Collection {
        id
        title
        handle
        image {
          id
          url(transform: {crop: CENTER, maxWidth: 300, maxHeight: 300, scale: 2})
          altText
        }
      }
      query BrandCollections {
        ${brandCollectionHandles
          .map(
            (handle) => `
          ${handle.replace(/-/g, '')}: collectionByHandle(handle: "${handle}") {
            ...Collection
          }
        `,
          )
          .join('')}
      }
    `;
};
