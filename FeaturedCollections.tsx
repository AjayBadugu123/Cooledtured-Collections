import {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';

// Define types for collection and image
type Image = {
  url: string;
  width: number;
  height: number;
  altText?: string;
};

type Collection = {
  id: string;
  title: string;
  image?: Image;
  handle: string;
};

// Define types for props
type FeaturedCollectionsProps = {
  storefrontAccessToken: string;
  domain: string;
};

// GraphQL query to fetch a collection by its handle
const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      image {
        url
        width
        height
        altText
      }
      handle
    }
  }
`;

// FeaturedCollections component
const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  storefrontAccessToken,
  domain,
}) => {
  const collections = useSignal<Collection[]>([]);

  // Define the handles for the collections you want to fetch
  const handles = ['bandai', 'banpresto', 'funko']; // Replace with actual collection handles

  useEffect(() => {
    // Function to fetch a single collection by its handle
    const fetchCollectionByHandle = async (
      handle: string,
    ): Promise<Collection | null> => {
      const response = await fetch(
        `https://${domain}/api/2022-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
          },
          body: JSON.stringify({
            query: COLLECTION_BY_HANDLE_QUERY,
            variables: {handle},
          }),
        },
      );

      const json = (await response.json()) as {
        data: {collectionByHandle: Collection};
      }; // Type assertion
      return json.data.collectionByHandle;
    };

    // Function to fetch all collections specified by the handles array
    const fetchCollections = async () => {
      const fetchedCollections = await Promise.all(
        handles.map((handle) => fetchCollectionByHandle(handle)),
      );
      collections.value = fetchedCollections.filter(
        (collection): collection is Collection => collection !== null,
      );
    };

    fetchCollections();
  }, [storefrontAccessToken, domain]);

  // Render the collections in a grid layout
  return (
    <div className="grid grid-cols-3 gap-4">
      {collections.value.map((collection) => (
        <div key={collection.id} className="featured-collection-item">
          <h2>{collection.title}</h2>
          {collection.image && (
            <img
              src={collection.image.url}
              alt={collection.image.altText}
              width={collection.image.width}
              height={collection.image.height}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedCollections;
