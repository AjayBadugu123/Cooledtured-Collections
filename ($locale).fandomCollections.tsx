import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import type {PredictiveCollectionFragment} from 'storefrontapi.generated';
import {fandomCollectionHandles} from '../CollectionConfigs/fandomCollectionsConfig';

// Loader function to fetch specific collections
export async function loader({context}: LoaderFunctionArgs) {
  const FANDOM_COLLECTIONS_QUERY = generateFandomCollectionsQuery();
  const response = await context.storefront.query(FANDOM_COLLECTIONS_QUERY);
  const collections = fandomCollectionHandles
    .map((handle) => response[handle.replace(/-/g, '')])
    .filter(Boolean);
  return json({collections});
}

// React component to display specific collections
export default function FandomCollections() {
  const {collections} = useLoaderData<typeof loader>();
  return (
    <div className="collections">
      <h1>Fandom Collections</h1>
      <div className="collections-grid">
        {collections.map((collection: PredictiveCollectionFragment) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="collection-item"
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
const generateFandomCollectionsQuery = () => {
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
    query FandomCollections {
      ${fandomCollectionHandles
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
