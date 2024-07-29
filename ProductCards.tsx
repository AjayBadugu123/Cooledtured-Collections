import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

type Product = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    nodes: Array<{
      id?: string | null;
      url?: string | null;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    }>;
  };
};

type ProductCardsProps = {
  products: {
    nodes: Product[];
  };
};

type MoneyData = {
  amount: string;
  currencyCode: 'USD';
};

const ProductCards: React.FC<ProductCardsProps> = ({products}) => {
  return (
    <>
      <style>
        {`
            .recommended-products-title {
                font-size: 200%;
                margin-bottom: 1%;
            }

            .recommended-products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 20px;
            }

            .recommended-product {
                position: relative;
                border: 3px solid #202C62;
                padding: 15px;
                border-radius: 20px;
                transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
                background-color: #202C62;
                height: 115%;
                margin-top: -10%;
                margin-bottom: 7%;
                
                &:hover {
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    transform: scale(1.05);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                animation: fadeIn 0.5s ease-out;
            }

            .product-image {
                display: flex;
            }

            .recommended-product small {
                display: block;
                margin-top: 5px;
                font-weight: bold;
                color: white;
            }

            .product-title {
                margin-top: 10px;
                color: white;
                font-weight: 200;
                
                &:hover {
                    text-decoration: underline;
                }
            }

            .add-to-cart {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                color: #202c62;
                border: 1px solid #333;
                border-radius: 50px;
                padding: 8px 16px;
                cursor: pointer;
                width: 90%;
                transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out;
            }

            .add-to-cart:hover {
                background-color: #202C62;
                color: white;
                border: 1px solid white;
            }

            @media screen and (max-width: 768px) {
                .recommended-products-grid {
                  display: grid;
                  grid-auto-columns: 45%;
                  grid-column-gap: 10fr;
                  grid-auto-flow: column;
                  padding: 5%;
                  overflow-x: scroll;
                  scroll-snap-type: x mandatory;
                }

                .add-to-cart {
                  margin-top: 10px;
                  width: 100%;
                }

                .recommended-product {
                  height: 110%;
                  margin-bottom: 25px;
                }          

                .product-title {
                    margin-top: 5px;
                }

                .add-to-cart {
                    bottom: 10px;
                }
            }
          `}
      </style>

      <h2 className="recommended-products-title">Recommended Products</h2>
      <br></br>
      <div className="recommended-products-grid">
        {products.nodes.map((product) => (
          <div key={product.id} className="recommended-product">
            <Link to={`/products/${product.handle}`}>
              <Image
                data={{
                  id: product.images.nodes[0]?.id,
                  url: product.images.nodes[0]?.url ?? 'fallback-url',
                  altText: product.images.nodes[0]?.altText,
                  width: product.images.nodes[0]?.width,
                  height: product.images.nodes[0]?.height,
                }}
                aspectRatio="1/1"
                sizes="(min-width: 45em) 20vw, 50vw"
                className="product-image"
              />
              <h4 className="product-title">{product.title}</h4>
              <small>
                <Money data={product.priceRange.minVariantPrice as MoneyData} />
              </small>
            </Link>
            <center>
              <button className="add-to-cart">Add To Cart</button>
            </center>
          </div>
        ))}
      </div>
      <br />
    </>
  );
};

export default ProductCards;
