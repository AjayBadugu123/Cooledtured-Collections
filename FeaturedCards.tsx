<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
const FeaturedCards = () => {
  return (
    <>
      <style>
        {`

        .featured-grid {
            display:grid;
            gap:2rem;
            justify-items: center;
        }

        .fc-cont1 {
            display: grid;
            padding: 1rem;
            border: solid grey;
            gap: 1rem;
            grid-template-columns: calc(48% - 0.666rem) calc(26% - 0.666rem) calc(26% - 0.666rem); // calc accounts for gap
        }

        .fc-cont2 {
            display: grid;
            padding: 1rem;
            border: solid grey;
            gap: 1rem;
            grid-template-columns: calc(33% - 0.5rem) calc(67% - 0.5rem);
        }

        /* Common styles for all cards */
        .fc-cont1 img, .fc-cont2 img {
            border: 1px solid grey;
            transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
            min-width:100%;
            min-height:100%;
            object-fit: cover;
            object-position: center;
        }

        /* Hover effect for all cards */
        .fc-cont1 img:hover, .fc-cont2 img:hover {
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
            transform: scale(1.01);
            cursor: pointer;
        }

        .collections-card {
            grid-row: 1 /span 2;
        }

        .international-card {
            grid-row: 1;
        }

        .gatcha-card {
            grid-row: 1;
        }

        .tcg-card {
            grid-row:2;
        }

        .cosplay-card {
            grid-row:2
        }

        .staffpick-card {
            grid-row:1
        }

        .pride-card {
            grid-row:2
        }

        .exclusives-card {
            grid-row: 1 / span 2;
            grid-column: 2;
        }



/*********** Responsive adjustments for mobile devices ***************/
        @media screen and (max-width: 768px) {
            .fc-cont1, .fc-cont2 {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: auto;
                padding:0.5rem;
                gap:0.6rem;
            }

            .collections-card{
                grid-column: 1 / span 2;
                grid-row: 1;
            }

            .international-card {
                grid-row: 2;
                grid-column: 1;
            }
    
            .gatcha-card {
                grid-row: 2;
                grid-column: 2;
            }
    
            .tcg-card {
                grid-row:3;
                gird-column: 1;
            }
    
            .cosplay-card {
                grid-row:3;
                grid-column:2;
            }

            .staffpick-card {
                grid-row: 2;
                grid-column: 1;
            }
    
            .pride-card {
                grid-row:2;
                grid-column: 2;
            }
    
            .exclusives-card {
                grid-row: 1;
                grid-column: 1 / span 2;
            }
        }
        `}
      </style>

      <div className="featured-grid">
        <div className="fc-cont1">
          <img
            className="collections-card"
            src="/images/FeaturedCards/placeholder.png"
            alt="Shop Set Collections"
          ></img>
          <img
            className="international-card"
            src="/images/FeaturedCards/International.png"
            alt="Shop International Shipping"
          ></img>
          <img
            className="gatcha-card"
            src="/images/FeaturedCards/Gatcha.png"
            alt="Shop Gatcha Collection"
          ></img>
          <img
            className="tcg-card"
            src="/images/FeaturedCards/TCG.png"
            alt="Shop TCG Products"
          ></img>
          <img
            className="cosplay-card"
            src="/images/FeaturedCards/Cosplay.png"
            alt="Shop Cosplay Products"
          ></img>
        </div>
        <div className="fc-cont2">
          <img
            className="staffpick-card"
            src="/images/FeaturedCards/StaffPick.png"
            alt="Shop Staff Picks"
          ></img>
          <img
            className="pride-card"
            src="/images/FeaturedCards/Pride.png"
            alt="Shop Pride Products"
          ></img>
          <img
            className="exclusives-card"
            src="/images/FeaturedCards/placeholder.png"
            alt="Shop Exclusives"
          ></img>
        </div>
      </div>
    </>
  );
};

export default FeaturedCards;
