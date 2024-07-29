import {
  Link,
  Form,
  useParams,
  useFetcher,
  useFetchers,
  type FormProps,
} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import {useNavigate} from 'react-router-dom';
import SearchFilter from './SearchFilter';

// Importing types for Predictive Search
import type {
  PredictiveProductFragment,
  PredictiveCollectionFragment,
  PredictiveArticleFragment,
  SearchQuery,
} from 'storefrontapi.generated';

// Define types for image and price to be used in Predictive Search
type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment['image']
  | PredictiveArticleFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

type PredictiveSearchResultItemPrice =
  | PredictiveProductFragment['variants']['nodes'][0]['price'];

// Define a normalized type for Predictive Search Result Items
export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  url: string;
};

// Define a normalized type for an array of Predictive Search Result Items
export type NormalizedPredictiveSearchResults = Array<
  | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'products'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'pages'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'articles'; items: Array<NormalizedPredictiveSearchResultItem>}
>;

// Define a normalized type for Predictive Search including the results and total count
export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalResults: number;
};

// Define return type for the fetch search results function
type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalResults: number;
  };
  searchTerm: string;
};

// Define a constant for no predictive search results
export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
  {type: 'collections', items: []},
  {type: 'pages', items: []},
  {type: 'articles', items: []},
];

// Component to render the search form
export function SearchForm({
  searchTerm,
  showSearchButton,
}: {
  searchTerm: string;
  showSearchButton?: boolean;
}) {
  // Use useRef for accessing the input DOM element
  const inputRef = useRef<HTMLInputElement | null>(null);
  // State hooks for filters
  const vendorFilters = useSignal<string[]>([]);
  const typeFilters = useSignal<string[]>([]);
  // Hook for navigation
  const navigate = useNavigate();

  // Effect hook to handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Focus the input on 'Cmd + K'
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Blur the input on 'Escape'
      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Function to handle changes in filters
  const handleFilterChange = (
    filterName: string,
    value: string,
    isChecked: boolean,
    filters: string[],
  ) => {
    let updatedFilters: string[] = [];
    // Update the filter array based on the checkbox state
    if (isChecked) {
      updatedFilters = [...filters, value];
    } else {
      updatedFilters = filters.filter((filter) => filter !== value);
    }

    // Update state based on filter type
    switch (filterName) {
      case 'vendor':
        vendorFilters.value = updatedFilters;
        break;
      case 'type':
        typeFilters.value = updatedFilters;
        break;
      default:
        break;
    }

    // Constructing query parameters for URL
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete(filterName);

    // If there are any updated filters, add them to the query parameters
    if (updatedFilters.length > 0) {
      queryParams.set(filterName, updatedFilters.join('|'));
    }

    // If there is a search term, add it to the query parameters
    if (searchTerm) {
      queryParams.set('q', searchTerm);
    }

    // Convert the query parameters to a string and navigate to the updated search URL
    const newSearchParams = queryParams.toString();
    navigate(`/search?${newSearchParams}`, {
      replace: true,
    });
  };

  // Handling the form submission
  const handleSubmit = () => {
    const queryParams = new URLSearchParams(window.location.search);
    // Set the search term in the query parameters
    if (searchTerm) {
      queryParams.set('q', searchTerm);
    }
    // Convert the query parameters to a string and navigate to the updated search URL
    const newSearchParams = queryParams.toString();
    navigate(`/search?${newSearchParams}`, {
      replace: true, // Replaces the current entry in the history stack
    });
  };

  // The render function for the SearchForm component
  return (
    <>
      <Form action="/search" method="get">
        {/* Search input and button */}
        <input
          id="search"
          defaultValue={searchTerm}
          name="q"
          placeholder="Search..."
          ref={inputRef}
          type="search"
        />
        &nbsp;
        {showSearchButton && (
          <button type="submit" onSubmit={handleSubmit}>
            Search
          </button>
        )}
        <SearchFilter handleFilterChange={handleFilterChange} />
      </Form>
    </>
  );
}

// Component for rendering search results
export function SearchResults({
  results,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'>) {
  // If there are no results, return null to render nothing
  if (!results) {
    return null;
  }

  // Get the keys of the results object (e.g., types of search results like 'pages', 'products')
  const keys = Object.keys(results) as Array<keyof typeof results>;

  // Map over each type of search result and render the appropriate component
  return (
    <div>
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];

          // Check the type of each search result and render the appropriate component
          if (resourceResults.nodes[0]?.__typename === 'Page') {
            const pageResults = resourceResults as SearchQuery['pages'];
            // Only render if there are nodes (results) available
            return resourceResults.nodes.length ? (
              <SearchResultPageGrid key="pages" pages={pageResults} />
            ) : null;
          }

          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
              />
            ) : null;
          }

          if (resourceResults.nodes[0]?.__typename === 'Article') {
            const articleResults = resourceResults as SearchQuery['articles'];
            return resourceResults.nodes.length ? (
              <SearchResultArticleGrid
                key="articles"
                articles={articleResults}
              />
            ) : null;
          }

          // Return null if the type is not recognized
          return null;
        })}
    </div>
  );
}

function SearchResultsProductsGrid({products}: Pick<SearchQuery, 'products'>) {
  // This component renders a grid of product search results.
  return (
    <div className="search-result">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          // Mapping each product to create a list of product items
          const itemsMarkup = nodes.map((product) => (
            <div className="search-results-item" key={product.id}>
              <Link prefetch="intent" to={`/products/${product.handle}`}>
                <span>{product.title}</span>
              </Link>
            </div>
          ));
          // Pagination links for navigating between product results
          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                {itemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultPageGrid({pages}: Pick<SearchQuery, 'pages'>) {
  // Renders a grid of page search results.
  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => (
          <div className="search-results-item" key={page.id}>
            <Link prefetch="intent" to={`/pages/${page.handle}`}>
              {page.title}
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}

function SearchResultArticleGrid({articles}: Pick<SearchQuery, 'articles'>) {
  // Renders a grid of article search results.
  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => (
          <div className="search-results-item" key={article.id}>
            <Link prefetch="intent" to={`/blog/${article.handle}`}>
              {article.title}
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}

export function NoSearchResults() {
  // Renders a message when no search results are found.
  return <p>No results, try a different search.</p>;
}

type ChildrenRenderProps = {
  // Defines the props passed to children in the PredictiveSearchForm.
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<NormalizedPredictiveSearchResults>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type SearchFromProps = {
  // Defines the props for the PredictiveSearchForm component.
  action?: FormProps['action'];
  method?: FormProps['method'];
  className?: string;
  children: (passedProps: ChildrenRenderProps) => React.ReactNode;
  [key: string]: unknown;
};

/**
 *  Search form component that posts search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  children,
  className = 'predictive-search-form',
  method = 'POST',
  ...props
}: SearchFromProps) {
  const params = useParams(); // Hook to access route parameters.
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>(); // Fetcher to handle dynamic data retrieval.
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref to track the search input DOM element.

  // Function triggered on input change to fetch search results.
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const searchAction = action ?? '/api/predictive-search'; // Default action if none is provided.
    // Adding locale to the action URL if available.
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    const newSearchTerm = event.target.value || ''; // Current value of the search input.
    // Submitting the search term to the fetcher with a limit of 6 results.
    fetcher.submit(
      {q: newSearchTerm, limit: '6'},
      {method, action: localizedAction},
    );
  }

  // Select the element based on the input
  // Setting the input type attribute to 'search' on component mount.
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  // Render function for the form component.
  return (
    <fetcher.Form
      {...props}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        // Do nothing if the input is empty.
        if (!inputRef?.current || inputRef.current.value === '') {
          return;
        }
        inputRef.current.blur(); // Remove focus from the input after submission.
      }}
    >
      {children({fetchResults, inputRef, fetcher})}{' '}
      {/*Rendering children withprovided props.*/}
    </fetcher.Form>
  );
}

export function PredictiveSearchResults() {
  // Destructuring properties from the usePredictiveSearch hook.
  const {results, totalResults, searchInputRef, searchTerm} =
    usePredictiveSearch();

  // Function to handle clicking on a search result.
  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur(); // Remove focus from the search input.
    searchInputRef.current.value = ''; // Clear the search input.
    // close the aside
    // Navigate to the clicked search result's URL
    window.location.href = event.currentTarget.href;
  }

  // Render null if there are no total results.
  if (!totalResults) {
    return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  }

  // Render the search results.
  return (
    <div className="predictive-search-results">
      <div>
        {/* Mapping over each result type (e.g., products, articles) and rendering them. */}
        {results.map(({type, items}) => (
          <PredictiveSearchResult
            goToSearchResult={goToSearchResult}
            items={items}
            key={type}
            searchTerm={searchTerm}
            type={type}
          />
        ))}
      </div>
      {/* Link to view all search results for the given term. */}
      {searchTerm.current && (
        <Link onClick={goToSearchResult} to={`/search?q=${searchTerm.current}`}>
          <p>
            View all results for <q>{searchTerm.current}</q>
            &nbsp; →
          </p>
        </Link>
      )}
    </div>
  );
}

function NoPredictiveSearchResults({
  // Mutable ref object containing the current search term.
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  // Render null if there is no current search term.
  if (!searchTerm.current) {
    return null;
  }
  // Render a message indicating no results were found for the given search term.
  return (
    <p>
      No results found for <q>{searchTerm.current}</q>
    </p>
  );
}

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};

function PredictiveSearchResult({
  goToSearchResult,
  items,
  searchTerm,
  type,
}: SearchResultTypeProps) {
  // Determines if the search result type is 'queries' for showing suggestions
  const isSuggestions = type === 'queries';
  // Constructs a URL for the category based on the search term and type
  const categoryUrl = `/search?q=${
    searchTerm.current
  }&type=${pluralToSingularSearchType(type)}`;

  return (
    <div className="predictive-search-result" key={type}>
      {/* Link to the category page */}
      <Link prefetch="intent" to={categoryUrl} onClick={goToSearchResult}>
        {/* Displays 'Suggestions' for query type, otherwise the type itself */}
        <h5>{isSuggestions ? 'Suggestions' : type}</h5>
      </Link>
      <ul>
        {/* List of items */}
        {items.map((item: NormalizedPredictiveSearchResultItem) => (
          <SearchResultItem
            goToSearchResult={goToSearchResult}
            item={item}
            key={item.id}
          />
        ))}
      </ul>
    </div>
  );
}

type SearchResultItemProps = Pick<SearchResultTypeProps, 'goToSearchResult'> & {
  item: NormalizedPredictiveSearchResultItem;
};

function SearchResultItem({goToSearchResult, item}: SearchResultItemProps) {
  // Renders individual search result items
  return (
    <li className="predictive-search-result-item" key={item.id}>
      {/* Link to the item's URL */}
      <Link onClick={goToSearchResult} to={item.url}>
        {/* If the item has an image, it's displayed */}
        {item.image?.url && (
          <Image
            alt={item.image.altText ?? ''}
            src={item.image.url}
            width={50}
            height={50}
          />
        )}
        <div>
          {/* If the item has a styledTitle, it's displayed using dangerouslySetInnerHTML */}
          {item.styledTitle ? (
            <div
              dangerouslySetInnerHTML={{
                __html: item.styledTitle,
              }}
            />
          ) : (
            // Otherwise, the item's title is displayed
            <span>{item.title}</span>
          )}
          {/* If the item has a price, it's displayed using the Money component */}
          {item?.price && (
            <small>
              <Money data={item.price} />
            </small>
          )}
        </div>
      </Link>
    </li>
  );
}

type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
};

function usePredictiveSearch(): UseSearchReturn {
  const fetchers = useFetchers(); // Retrieves an array of fetcher objects managed by the application.
  const searchTerm = useRef<string>(''); // A ref to store the current search term.
  const searchInputRef = useRef<HTMLInputElement | null>(null); // A ref to the search input
  // Finding the specific fetcher that handles search results.
  const searchFetcher = fetchers.find((fetcher) => fetcher.data?.searchResults);

  // If the search fetcher is in a loading state, update the searchTerm ref.
  if (searchFetcher?.state === 'loading') {
    searchTerm.current = (searchFetcher.formData?.get('q') || '') as string;
  }

  // Defining the search data structure, with a fallback to defaults if no data is found.
  const search = (searchFetcher?.data?.searchResults || {
    results: NO_PREDICTIVE_SEARCH_RESULTS,
    totalResults: 0,
  }) as NormalizedPredictiveSearch;

  // useEffect hook to capture the search input element as a ref.
  useEffect(() => {
    if (searchInputRef.current) return; // Exit if the ref is already set.
    // Setting the search input ref to the first search input element found in the document.
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  // Returning the search data along with the refs.
  return {...search, searchInputRef, searchTerm};
}

/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 */
function pluralToSingularSearchType(
  type:
    | NormalizedPredictiveSearchResults[number]['type']
    | Array<NormalizedPredictiveSearchResults[number]['type']>,
) {
  const plural = {
    articles: 'ARTICLE',
    collections: 'COLLECTION',
    pages: 'PAGE',
    products: 'PRODUCT',
    queries: 'QUERY',
  };

  // Convert a singular type or an array of types to their singular counterparts.
  if (typeof type === 'string') {
    return plural[type]; // For a single type string, return its singular form.
  }

  return type.map((t) => plural[t]).join(','); // For an array of types, map each to its singular form and join with commas.
}
