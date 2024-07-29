import {NavLink} from '@remix-run/react';
import CopyrightBar from './copyrightBar';

import MailingList from '~/components/mailingList';

/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */
export function Footer() {
  return (
    <footer className="footer bg-slate-400 pt-4">
      <div
        style={{
          color: 'black',
          display: 'flex',
          marginLeft: '70px',
          gap: '50px',
        }}
      >
        <FooterMenuSection title="Company Info" links={companyInfoLinks} />
        <FooterMenuSection title="Support" links={supportLinks} />
        <FooterMenuSection title="Legal Policy" links={legalPolicyLinks} />
        <MailingList />
      </div>
      <CopyrightBar />
    </footer>
  );
}

/**
 * @param {{
 *   title: string;
 *   links: { id: string; title: string; url: string }[];
 * }}
 */
interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface FooterMenuSectionProps {
  title: string;
  links: LinkItem[];
}

function FooterMenuSection({
  title,
  links,
}: FooterMenuSectionProps): JSX.Element {
  return (
    <div className="footer-menu-section">
      <div
        className="flex flex-col"
        style={{alignItems: 'center', textAlign: 'center'}}
      >
        <h4 style={{margin: '0'}}>{title}</h4>
        <nav
          className="footer-menu"
          role="navigation"
          style={{flexDirection: 'column'}}
        >
          {links.map((item: LinkItem) => (
            <NavLink key={item.id} end prefetch="intent" to={item.url}>
              <h5 style={{margin: '0', color: 'black'}}>{item.title}</h5>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

const companyInfoLinks = [
  {id: 'link1-1', title: 'About Us', url: 'header'},
  {id: 'link1-2', title: 'FAQs', url: 'header'},
  {id: 'link1-3', title: 'We are Hiring', url: 'header'},
  {id: 'link1-3', title: 'Blog', url: 'header'},
];

const supportLinks = [
  {id: 'link2-1', title: 'Live Agent', url: 'header'},
  {id: 'link2-2', title: 'Email', url: 'header'},
  {id: 'link2-3', title: 'Hours of Operation', url: 'header'},
];

const legalPolicyLinks = [
  {id: 'link3-1', title: 'Affiliate Program', url: 'header'},
  {id: 'link3-2', title: 'Search', url: 'header'},
  {id: 'link3-3', title: 'Terms of Service', url: 'header'},
  {id: 'link3-3', title: 'Refund Policy', url: 'header'},
];

// import {NavLink} from '@remix-run/react';
// import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
// // Using a custom hook to access root loader data (e.g., global data available in the entire app)
// import {useRootLoaderData} from '~/root';

// // Footer component definition
// export function Footer({
//   menu,
//   shop,
// }: FooterQuery & {shop: HeaderQuery['shop']}) {
//   // Render the footer element
//   return (
//     <footer className="footer">
//       <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
//     </footer>
//   );
// }

// // FooterMenu functional component definition
// function FooterMenu({
//   menu, // Footer menu data
//   primaryDomainUrl,
// }: {
//   menu: FooterQuery['menu'];
//   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
// }) {
//   // Accessing the public store domain from the root loader data
//   const {publicStoreDomain} = useRootLoaderData();

//   // Return a navigation element for the footer menu
//   return (
//     <nav className="footer-menu" role="navigation">
//       {/* Mapping over menu items. FALLBACK_FOOTER_MENU is used if menu is not provided */}
//       {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
//         // Skip rendering if the item doesn't have a URL
//         if (!item.url) return null;
//         // Determine if the URL is internal or External
//         const url =
//           item.url.includes('myshopify.com') ||
//           item.url.includes(publicStoreDomain) ||
//           item.url.includes(primaryDomainUrl)
//             ? new URL(item.url).pathname // Internal: strip the domain
//             : item.url; // External: use the full URL
//         const isExternal = !url.startsWith('/'); // Check if the URL is external

//         // Render an anchor tag for external links and NavLink for internal links
//         return isExternal ? (
//           <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
//             {item.title}
//           </a>
//         ) : (
//           <NavLink
//             end
//             key={item.id}
//             prefetch="intent"
//             style={activeLinkStyle}
//             to={url}
//           >
//             {item.title}
//           </NavLink>
//         );
//       })}
//     </nav>
//   );
// }

// // Fallback menu data for the footer if no menu data is provided
// const FALLBACK_FOOTER_MENU = {
//   id: 'gid://shopify/Menu/199655620664',
//   items: [
//     {
//       id: 'gid://shopify/MenuItem/461633060920',
//       resourceId: 'gid://shopify/ShopPolicy/23358046264',
//       tags: [],
//       title: 'Privacy Policy',
//       type: 'SHOP_POLICY',
//       url: '/policies/privacy-policy',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461633093688',
//       resourceId: 'gid://shopify/ShopPolicy/23358013496',
//       tags: [],
//       title: 'Refund Policy',
//       type: 'SHOP_POLICY',
//       url: '/policies/refund-policy',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461633126456',
//       resourceId: 'gid://shopify/ShopPolicy/23358111800',
//       tags: [],
//       title: 'Shipping Policy',
//       type: 'SHOP_POLICY',
//       url: '/policies/shipping-policy',
//       items: [],
//     },
//     {
//       id: 'gid://shopify/MenuItem/461633159224',
//       resourceId: 'gid://shopify/ShopPolicy/23358079032',
//       tags: [],
//       title: 'Terms of Service',
//       type: 'SHOP_POLICY',
//       url: '/policies/terms-of-service',
//       items: [],
//     },
//   ],
// };

// // Function to define styles for active and pending navigation links
// function activeLinkStyle({
//   isActive,
//   isPending,
// }: {
//   isActive: boolean;
//   isPending: boolean;
// }) {
//   // Return styles based on isActive and isPending states
//   return {
//     fontWeight: isActive ? 'bold' : undefined,
//     color: isPending ? 'grey' : 'white',
//   };
// }
