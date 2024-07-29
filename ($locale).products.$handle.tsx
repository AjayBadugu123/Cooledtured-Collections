import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import {useSignal} from '@preact/signals-react';
import TagOverlay from '~/components/TagOverlay';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

// Loader function to load and fetch data for the product
export async function loader({params, request, context}: LoaderFunctionArgs) {
  // Extracts the product handle from the route parameters.
  const {handle} = params;
  // Extracts the storefront object from the context, which is used to make queries to the Shopify Storefront API.
  const {storefront} = context;

  // Retrieves selected product options from the request and filters out unnecessary query parameters.
  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  // Checks if a product handle is defined in the route. If not, it throws an error.
  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Performs a GraphQL query to fetch product data based on the product handle and selected options.
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  // Checks if the product was found. If not, it throws a 404 response, indicating the product does not exist.
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Retrieves the first variant of the product.
  const firstVariant = product.variants.nodes[0];
  // Checks if the first variant is the default variant
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  // If the first variant is default, it sets it as the selected variant. Otherwise, additional logic is applied to determine the selected variant.
  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  // Returning the fetched data
  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

// This is the main React component for the product page. It uses the data fetched in the loader to render the product details.
export default function Product() {
  // product and variants are destructured from the loaded data. selectedVariant is then extracted from product.
  // @ts-ignore
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  return (
    // The component renders a div with two child components: ProductImage (for displaying the product image) and ProductMain (for displaying main product details).
    <div className="product mt-8 mx-16">
      {/* Render ProductDisplay with the full product data including all images */}
      <ProductDisplay product={product} />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
      />
    </div>
  );
}

// type definition for ProductDisplay()
type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
};

type Product = {
  tags: string[];
  id: string;
  title: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
};

function ProductDisplay({product}: {product: Product}) {
  // Using useSignal to manage the state of the currently displayed image
  const currentImage = useSignal<ProductImage>(product.images.edges[0].node);

  // Function to change the main image with a fade effect
  const isChanging = useSignal(false);

  const changeImage = (newImage: ProductImage) => {
    isChanging.value = true; // Indicate that the image is changing
    setTimeout(() => {
      currentImage.value = newImage;
      isChanging.value = false; // Reset after changing the image
    }, 100); // Duration of fade effect
  };

  return (
    <div className="w-2xl min-w-max justify-center">
      {/* Main Image with Scale and Fade Transition Effect */}
      <div className="mb-4 overflow-hidden h-96 w-full relative">
        {' '}
        {/* Adjust h-96 to your desired fixed height */}
        <img
          src={currentImage.value.url}
          alt={currentImage.value.altText || 'Product Image'}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-100 ease-in-out ${
            isChanging.value ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        <TagOverlay tags={product.tags} />
      </div>

      {/* Image Selector */}
      <div className="flex justify-center p-2 overflow-x-auto gap-2">
        {product.images.edges.map(({node}) => (
          <img
            key={node.id}
            src={node.url}
            alt={node.altText || 'Product Image Thumbnail'}
            onClick={() => changeImage(node)}
            className={`cursor-pointer border border-slate-300 ${
              currentImage.value.id === node.id
                ? 'ring-2 ring-blue-500 border-none'
                : ''
            } w-20 h-20 object-cover transition-all duration-100 ease-out`}
          />
        ))}
      </div>
    </div>
  );
}

// This component renders the main content of the product page, including the product title, price, and description.
function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            // ProductForm shows product options and an add-to-cart button.
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
    </div>
  );
}

//  If there's a compare-at price (indicating a sale), it shows the sale price alongside the original price marked with a strikethrough.
function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

// Handles the product form, including variant selection and add-to-cart functionality.
function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

// Renders options for a product variant, such as different sizes or colors.
function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

// Renders a button to add items to the cart.
function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    // Wrapped within a CartForm component, which handles the form submission for adding items to the cart.
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

// Defines a GraphQL fragment for product variant data.
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
      tags
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

// Defines a GraphQL fragment for product data, including the selected variant and SEO details.
const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    tags
    descriptionHtml
    description
    options {
      name
      values
    }
    images(first: 20) { #Fetch all images associated with the product
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

// Defines a GraphQL query to fetch product data, including variants and SEO information.
const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
