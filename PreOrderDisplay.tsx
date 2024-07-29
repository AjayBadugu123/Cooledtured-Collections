import {Link} from '@remix-run/react';
import TagOverlay from './TagOverlay';

// Define TypeScript types for product-related data
type ProductImage = {
  transformedSrc: string;
  altText?: string;
};

type ProductPrice = {
  amount: string;
  currencyCode: string;
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  images: {
    edges: Array<{node: ProductImage}>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
};

// Define a type for preOrderData data that includes products
type PreOrderData = {
  products: {
    edges: Array<{node: ProductNode}>;
  };
};

// Create a React functional component named 'PreOrderDisplay' that takes 'preOrderData' as a prop - preOrderData is what is passed from ._index.tsx in the Homepage function
const PreOrderDisplay: React.FC<{
  preOrderData: PreOrderData;
}> = ({preOrderData}) => {
  if (!preOrderData) return null;

  return (
    // Create a grid layout with varying columns based on screen size
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {preOrderData.products.edges.map(({node: product}) => (
        <div key={product.id} className="product-card">
          {product.images.edges.length > 0 && (
            <Link to={`/products/${product.handle}`}>
              {/* Image Container */}
              <div className="relative">
                <img
                  src={product.images.edges[0].node.transformedSrc}
                  alt={product.images.edges[0].node.altText || 'Product Image'}
                  className="w-full"
                />
                {/* Tags Overlay */}
                <TagOverlay tags={product.tags} />
              </div>
            </Link>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              <Link to={`/products/${product.handle}`}>{product.title}</Link>
            </h3>
            <p className="text-gray-600">
              {product.priceRange.minVariantPrice.amount}{' '}
              {product.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreOrderDisplay;
