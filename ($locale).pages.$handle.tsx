import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import FAQPage from '~/components/FAQPage';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // @ts-ignore
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  const isFAQPage = page && page.title === 'FAQs';

  return (
    <div className="page">
      <header>
        <h1 className="text-3xl font-bold text-center mb-8 mt-8">
          {page.title === 'FAQs' ? 'Frequently Asked Questions' : page.title}
        </h1>
      </header>
      {isFAQPage ? (
        <FAQPage />
      ) : (
        <div dangerouslySetInnerHTML={{__html: page.body}} />
      )}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
