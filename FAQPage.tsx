import React from 'react';
import { useSignal } from "@preact/signals-react";

interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

interface FAQItems {
  General: FAQItem[];
  Billing: FAQItem[];
  Orders: FAQItem[];
  Shipping: FAQItem[];
  Community: FAQItem[];
}

interface CategoryButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      style={{
        width: '150px',
        height: '70px',
        borderRadius: '0px',
        backgroundColor: active ? 'darkblue' : 'darkblue',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        outline: 'none',
        borderBottom: active ? '6px solid #bf8332' : 'none',
        transition: 'all 0.3s ease', 
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = active ? 'slate-400' : 'darkblue';
        e.currentTarget.style.width = '155px'; 
        e.currentTarget.style.height = '75px'; 
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active ? 'slate-400' : 'darkblue';
        e.currentTarget.style.width = '150px'; 
        e.currentTarget.style.height = '70px'; 
      }}
    >
      {children}
    </button>
  );
};

const FAQPage: React.FC = () => {
  const faqItems = useSignal<FAQItems>({
    General: [
      {
        "question": "What type of products do you sell?",
        "answer": "Fuel your fandom, from head to toe! We offer a vibrant tapestry of apparel, figures, homeware, and collectibles, all curated to ignite your passion. Find your perfect piece and let your fandom flag fly! "
      },
      {
        "question": "Do you have a physical store or are you online only?",
        "answer": "While we currently operate online, whispers of a physical abound (if you check our socials). Stay tuned, fellow fans, for exciting updates on our quest to bring your fandom to life in the real world! "
      },
      {
        "question": "Do you offer rewards programs or loyalty points?",
        "answer": "Show your passion and earn Cooledtured Points with every purchase. Level up your account, unlock secret discounts, and claim personalized rewards that fuel your epic fandom journey! "
      },
      {
        "question": "Do you hold events or workshops?",
        "answer": "We love teaming up with fellow adventurers for epic events and workshops. Keep an eye out for collaborations with your favorite creators, and prepare to join the ultimate fandom celebration! "
      },
      {
        "question": "Do you have a showcase store?",
        "answer": "Not yet, but picture a pop-up adventure! We're nomadic explorers, not brick-and-mortar dwellers! We bring the coolest corners of pop culture right to your city. Follow our socials for a front-row seat to the next epic pop-up collaboration."
      },
      {
        "question": "What is a Buyer Protection?",
        "answer": "Think of Buyer Protection as your personal pop culture kryptonite against shopping mishaps! Buyer Protection offers peace of mind, guaranteeing delivery, accurate product descriptions, and the authenticity of all merchandise. Shop with confidence and focus on your fandom! "
      },
    ],
    Orders: [
      {
        "question": "Do you carry pre-orders or exclusive items?",
        "answer": "Want guaranteed loot and rare treasures? Pre-orders let you secure your future, while exclusives make you a fandom MVP! We bring the heat with early access and limited-edition drops."
      },
      {
        "question": "Do you offer authentic merchandise?",
        "answer": "Your fandom deserves the best! We source only authentic merchandise, partnering with official licensors to ensure your epic loot is genuine. Unwrap joy, not counterfeits, and let your fandom shine! "
      },
      {
        "question": "Do you offer signed or limited edition collectibles?",
        "answer": "Limited editions and signatures exist! Though not our daily quest, we keep our ears to the ground and bring you these prized artifacts when opportunity arises. Prepare for thrills, fellow fans, for these legendary hauls disappear in a blink!"
      },
      {
        "question": "Do you carry replicas or costume replicas for cosplay?",
        "answer": "Level up your cosplay beyond mere replicas! We offer high-quality gear that sparks your imagination and ignites your inner hero. Craft a look that's uniquely yours with our diverse treasures and let your fandom shine! "
      },
      {
        "question": "Do you stock vintage or rare pop culture items?",
        "answer": "Rare finds? We know the thrill! While our main quest is fresh loot, we occasionally stumble upon authentic vintage treasures. These limited-edition gems are whispered about in our community, so keep your ears tuned for the next epic artifact hunt! "
      },
      {
        "question": "I only received half of my order. where is the rest of it?",
        "answer": "Missing some of your loot? We apologize! Sometimes, like epic quests, your loot arrives in installments. This might happen with popular items that need a little extra time to assemble. Don't fret, though! We'll send you the rest, with separate tracking spells for each part of your adventure. Rest assured, all your treasures will arrive safely! "
      },
      {
        "question": "I need an item sent before \"X\" date as a B-day\/Holiday gift",
        "answer": "Gifting crunch time? We understand! While pre-X deliveries can't always be guaranteed, we're here to help. Contact us for shipping estimates, consider expedited options, and reach out before you order. We'll do everything we can to make your special day even more epic! "
      },
      {
        "question": "Why are your toys still on pre-orders while others have them in stock?",
        "answer": "We're not like the big guys! We champion independent creators and curate unique finds. We prioritize quality over speed! While some retailers rush stock, we meticulously ensure each toy meets our high standards. This means pre-orders may take slightly longer, but rest assured, your epic loot will be worth the wait! "
      },
      {
        "question": "The tag on the clothing is not the same size that I ordered.",
        "answer": "Please read our clothing size page carefully if you are interested in ordering any clothing."
      },
      {
        "question": "Damages",
        "answer": "Quality is our quest! Damaged loot is never part of the plan. Simply contact us with photos and your receipt, and our dedicated team will spring into action to replace or refund within 5 business days. Your happy fandom is our mission! "
      },
      {
        "question": "Cancellations & Refunds policy",
        "answer": "Change of heart? We get it! Within 24 hours, simply tell us and your epic loot can change course. After that, a small admin fee joins the quest, and if shipped, return costs become your trusty steed. Refunds gallop back to your original credit card! "
      },
      {
        "question": "Returns policy",
        "answer": "Please note that merchandise are generally mass produced and as such minor cosmetic imperfections may appear from time to time. This does not mean your product is defective. We will not allow returns for any form of minor cosmetic imperfections that arise from production such as faded paint, scratches, bubbles, missing paint spots, visible seams etc. Although these are by no means common occurrences, these are outside the scope of our control and due to the collectable & costly nature of anime products in general, we will not authorize returns, refunds, or replacements for situations where this may occur. Because of the collectible nature of the products we sell, we will not accept returns and all sales are considered final unless:\n\n(1) WRONG ITEM WAS SENT\n\nAlthough very unlikely, we'll get the situation corrected immediately! Return shipping on us. All returned merchandise must be in new (unopened), re-sellable condition, in its original retail packaging. Simply contact us through our contact form or email info@cooledtured.com\n\n(2) ITEM ARRIVED DAMAGED\n\nWe understand that as uncommon as it is, things happen. We will work to correct the issue through a replacement or refund as soon as possible at our discretion based on the situation."
      }
    ],
    Shipping: [
      {
        "question": "How do you ship packages?",
        "answer": "Speed and safety first! We partner with USPS for nimble packages and select trusted carriers for larger treasures, ensuring your loot reaches its destination swiftly and securely. We prioritize efficiency, so you can focus on the excitement! "
      },
      {
        "question": "Do you ship worldwide?",
        "answer": "While we haven't reached every corner of the universe yet, our shipping map is ever-evolving! While some destinations await their turn, we actively expand our reach to bring coolness to the world. If your location isn't on our current map, reach out - we're always exploring new adventures! "
      },
      {
        "question": "How are shipping costs calculated?",
        "answer": "We calculate shipping costs based on your chosen speed (air, land, or sea), the adventurer's pack weight, and the journey's distance. Different couriers offer different rates, so we'll find the most budget-friendly path for your epic haul. Contact us for further details if you get lost! "
      },
      {
        "question": "How long will it take until I get a tracking number emailed to me?",
        "answer": "Hold your tricorder, fellow geekonaut! Tracking numbers typically beam into your inbox within 24 hours of your order launch. If it’s a pre-order then your code hasn't landed yet, don't fret! We'll send it at warp speed as soon as it's ready in our warehouse. Stay tuned for your loot's live feed! "
      },
      {
        "question": "How long does shipping take?",
        "answer": "No need for crystal balls! Orders usually take 2-5 business days to pack their bags, and the delivery leg depends on your destination about 3-7 business days for most adventurers. Pre-orders take a bit longer, joining the quest once they arrive at our warehouse. Don't worry, we'll send you tracking spells to follow your loot! Clear skies for smooth shipping! "
      },
      {
        "question": "Is there a tracking information provided?",
        "answer": "Rest assured, your loot travels with a trusty tracker! Regardless of shipping option, we email your tracking code as soon as your package embarks on its journey. You can then follow its every move and anticipate its grand arrival! "
      },
      {
        "question": "Where can I track my item?",
        "answer": "Your package's whereabouts are just a click away! Once your order ships, we'll send you a personalized tracking code via email. You can then use it to track your package's progress on most major shipping carrier websites, including www.USPS.com. Stay tuned and get ready to celebrate! "
      },
      {
        "question": "My tracking says 'no information available at the moment'.",
        "answer": "Tracking can sometimes be a bit cryptic! While most information updates within 3-5 business days, some couriers take a little longer to map your loot's journey. We'll keep you updated every step of the way, so rest assured your epic treasure is on its way! For pre-orders, the adventure starts when it reaches our warehouse, then we'll share its tracking code like a precious treasure map! "
      },
      {
        "question": "Will I get a confirmation number?",
        "answer": "We value your peace of mind! A confirmation email with your special code instantly follows your order, signifying its arrival in our system. Stay tuned for shipping updates, and feel free to contact us if you have any questions – your adventure starts here! "
      },
      {
        "question": "Is local pick up available?",
        "answer": "Bypass the courier's route! Opt for swift local pick-up at our Bensenville office. Contact us to schedule your visit and collect your epic loot in a flash! "
      },
      {
        "question": "Will my items be sent in one packages?",
        "answer": "Packing efficiency sometimes means split adventures! While we aim for one epic delivery, certain items may journey solo for faster arrival. Rest assured, you'll receive tracking for each package and can celebrate their combined arrival soon! "
      },
      {
        "question": "I got a tracking number but I can't track it.",
        "answer": "Can't follow your package's path? We apologize for the tracking mystery! International journeys sometimes involve uncharted territory, meaning detailed tracking may only appear once your order reaches its destination country. This usually takes 3-7 days, but don't worry, we'll keep you updated every step of the way and ensure your epic haul arrives safely"
      },
      {
        "question": "Why does my estimated delivery date keep on changing?",
        "answer": "Delivery hiccups? We feel your frustration! Estimated dates can change due to unforeseen circumstances beyond our control. We apologize for the inconvenience and prioritize keeping you informed with prompt updates on our Shipping Updates page. Rest assured, your epic loot is still on its way! "
      },
    ],
    Billing: [
      {
        "question": "What are the Payment Methods available?",
        "answer": "At Cooledtured, we speak fluent Geekonomics! We accept a multiverse of payment options - Visa, Mastercard, the digital force, and even Stripe! Shopify Pay, Google Pay, Apple Pay, and PayPal join the party too. Choose your portal (card, phone, etc.) and unleash your inner financial Jedi on checkout! Need help? Contact our tech wizards! "
      },
      {
        "question": "Can I split my payment into installments?",
        "answer": "Your epic loot may be vast, but your wallet doesn't have to be! Conquer your budget with Shop Pay installments. Spread your quest's cost over time and claim your treasures piece by piece. Adventure awaits! "
      },
      {
        "question": "Do you store my credit card information after I place an order?",
        "answer": "Security spells at the ready! We partner with trusted payment gateways to keep your credit card info under lock and key. Once your order's complete, it vanishes like a well-cast invisibility charm, leaving only the joy of your fandom haul! "
      },
      {
        "question": "Are my Payment Information Secure?",
        "answer": "Transparency is our mantra, security our shield. We use industry-leading encryption and partner with Stripe and PayPal's secure payment gateways to safeguard your information. We care about your data as much as we care about your fandom, so shop with confidence knowing all major credit card companies are supported. "
      },
      {
        "question": "Do you comply with any data privacy regulations?",
        "answer": "Your privacy is our shield! We value your trust and uphold your data rights under regulations like GDPR and CCPA. Explore our portal knowing your info is protected, fellow adventurer!"
      },
    ],
    Community: [
      {
        "question": "Do you have a community forum or online board?",
        "answer": "Cooledtured isn't just a store, it's a portal! Dive deeper into your fandoms through our official Discord server. Talk shop, unleash your creativity, and forge friendships with fellow fanatics. The ultimate hangout awaits! "
      },
      {
        "question": "Do you host online or offline events for fans?",
        "answer": "We host epic online and offline events to celebrate your fandoms. From virtual watch parties to real-life meet-ups, keep your eyes peeled on our social media for upcoming quests!"
      },
      {
        "question": "Do you partner with any other pop culture organizations or events?",
        "answer": "We partner with diverse pop culture organizations and events to connect you with fellow adventurers and offer insider access. Unleash your inner hero and celebrate your passion in community!"
      },
      {
        "question": "How can I become a brand ambassador or influencer for Cooledtured?",
        "answer": "Our fandom family thrives on passion! If you're a creative force within our community, sharing your Cooledtured love with infectious enthusiasm, let's connect! We're always looking for talented adventurers to amplify our epic loot and inspire fellow fans. Join the quest!"
      },
      {
        "question": "Do you have any internship opportunities available?",
        "answer": "We believe every fan deserves a chance to shine! While current quests are filled, your passion for fandom could be the missing piece. Reach out and tell us your story! You might just inspire the next chapter in our adventure. "
      },
      {
        "question": "Are you sustainable or eco-conscious in your business practices?",
        "answer": "We embrace sustainable practices like eco-friendly packaging and ethical sourcing. Join our quest for epic loot that does good for the planet, one adventure at a time! ("
      },
      {
        "question": "Do you give back to the community in any way?",
        "answer": "Your fandom fuels our mission! With every epic purchase, you help us support causes that spark creativity and build community. Together, we make the world a cooler place, one fandom adventure at a time!"
      },
      {
        "question": "Do you have a referral program for new customers?",
        "answer": "Share your Cooledtured referral code with fellow adventurers, and you'll both score bonus loot! They'll embark on an epic quest for their own treasures, and you'll get extra goodies for guiding them. Together, conquer the fandom mountains!"
      },
      {
        "question": "Do you host contests or giveaways on social media?",
        "answer": "Adventure awaits on our social media channels! Keep your eyes peeled for epic contests and giveaways – your next loot haul could be just a post away! Join the quest, unleash your fandom, and prepare to claim victory"
      },
      {
        "question": "Can I share my Cooledtured purchases on your social media pages?",
        "answer": "Seeing your joy fuels our quest! Share your Cooledtured haul on our social media pages and tag us. We love celebrating your fandom victories and might even feature your epic loot! Let's level up together!"
      },
      {
        "question": "Do you sponsor any gaming tournaments or fan conventions?",
        "answer": "Cooledtured loves leveling up fandom joy! We proudly sponsor gaming tournaments and fan conventions, creating spaces for heroes to unite. Join the celebration and experience the magic live – we'll be there cheering you on! "
      },
      {
        "question": "How can I partner with Cooledtured for my own fan project or event?",
        "answer": "We believe in empowering passionate creators. Share your fan project or event idea, and we'll see how we can support your journey. Let's make fandom dreams a reality, together!"
      },
      {
        "question": "Do you offer any educational resources or workshops related to pop culture?",
        "answer": "We're always looking for passionate creators and educators to collaborate with. If you have an epic workshop idea, reach out! Together, let's build a vibrant landscape of pop culture learning!"
      },
    ],
  });

  const activeCategory = useSignal<'General' | 'Orders' | 'Shipping' | 'Billing' | 'Community'>('General');

  const toggleCategory = (category: 'General' | 'Orders' | 'Shipping' | 'Billing' | 'Community') => {
    activeCategory.value = category;
  };

const handleToggle = (index: number) => {
  const updatedFAQItems = {...faqItems.value};
  updatedFAQItems[activeCategory.value][index].isOpen = !updatedFAQItems[activeCategory.value][index].isOpen;
  faqItems.value = updatedFAQItems;
};


  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-center mb-4 space-x-4">
        <CategoryButton
          active={activeCategory.value === 'General'}
          onClick={() => toggleCategory('General')}
        >
          General
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Orders'}
          onClick={() => toggleCategory('Orders')}
        >
          Orders
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Shipping'}
          onClick={() => toggleCategory('Shipping')}
        >
          Shipping
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Billing'}
          onClick={() => toggleCategory('Billing')}
        >
          Payments & Security
        </CategoryButton>
        <CategoryButton
          active={activeCategory.value === 'Community'}
          onClick={() => toggleCategory('Community')}
        >
          Community
        </CategoryButton>
      </div>

      <div className="space-y-4">
        {faqItems.value[activeCategory.value].map((item, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded bg-gray-300">
            <div
              className="font-semibold flex items-center cursor-pointer hover:text-blue-500"
              onClick={() => handleToggle(index)}
            >
              {/* <span className="mr-2 text-2xl">{item.isOpen ? '▽' : '▷'}</span> */}
              <span className="mr-2 text-2xl">{item.isOpen ? '-' : '+'}</span>
              {item.question}
            </div>
            {item.isOpen && (
              <div className="mt-2 pl-4 border-l-2 border-gray-400">
                {item.answer.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-2">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
