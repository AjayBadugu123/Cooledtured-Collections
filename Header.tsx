import {Await, NavLink} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {
  FaBars,
  FaSearch,
  FaUser,
  FaSignInAlt,
  FaShoppingCart,
  FaAngleRight,
  FaAngleDown,
  FaLine,
} from 'react-icons/fa';

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;
type Viewport = 'desktop' | 'mobile';

type MobileMenuProps = {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
};

const MobileMenu = ({menu, primaryDomainUrl}: MobileMenuProps) => {
  const {publicStoreDomain} = useRootLoaderData();
  const isMenuOpen = useSignal(false);

  // State to manage the visibility of each submenu
  const submenuVisibility = useSignal(new Map<string, boolean>());

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const toggleSubmenu = (itemId: string) => {
    submenuVisibility.value.set(itemId, !submenuVisibility.value.get(itemId));
    submenuVisibility.value = new Map(submenuVisibility.value);
  };

  // Determine if any submenu is visible for setting width
  const isAnySubmenuVisible = Array.from(submenuVisibility.value.values()).some(
    (value) => value,
  );

  const getNavLinkUrl = (item: any) => {
    // Custom URL logic for "Brands" & "Fandoms"
    if (item.title === 'Brands') {
      return '/brandCollections';
    } else if (item.title === 'Fandoms') {
      return '/fandomCollections';
    }

    // Check if itemUrl is defined
    if (!item.url) return '#';

    // Existing logic for internal links
    if (
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
      item.url.includes(primaryDomainUrl)
    ) {
      return new URL(item.url).pathname;
    }
    return item.url;
  };

  if (!menu) {
    return null;
  }

  return (
    <>
      {/* Menu Icon  */}
      <button
        onClick={toggleMenu}
        className="text-3xl text-slate-200 md:hidden hover:scale-105 hover:text-amber-500 transition-all duration-100"
      >
        <FaBars />
      </button>
      {isMenuOpen.value && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
      {/* Mobile Menu Aside */}
      <div
        className={`fixed top-20 left-0 h-auto ${
          isAnySubmenuVisible ? 'w-52' : 'w-44'
        } bg-blue-950  border-r-amber-500 border-b-amber-500 border-r-2 border-b-2 transform transition-all duration-500 z-50 ${
          isMenuOpen.value ? 'translate-x-0' : '-translate-x-full'
        } `}
      >
        <div className="text-slate-200 p-4">
          {menu.items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Main Menu Items */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <NavLink
                  onClick={closeMenu}
                  prefetch="intent"
                  to={getNavLinkUrl(item)}
                  className={`block col-span-1 py-2 whitespace-nowrap hover:scale-105 hover:text-amber-500 transition-all duration-100 ${
                    submenuVisibility.value.get(item.id) &&
                    (item.title === 'Brands' || item.title === 'Fandoms')
                      ? 'text-amber-500'
                      : 'text-slate-200'
                  }`}
                >
                  {item.title}
                </NavLink>
                {(item.title === 'Brands' || item.title === 'Fandoms') && (
                  <div
                    onClick={() => toggleSubmenu(item.id)}
                    className={`cursor-pointer p-1 bg-slate-900 rounded-full align-middle translate-y-0.5 hover:scale-105 transition-all duration-300 col-start-2 w-6 ${
                      isAnySubmenuVisible ? 'ml-16' : 'ml-12'
                    }`}
                  >
                    {submenuVisibility.value.get(item.id) ? (
                      <FaAngleDown className="text-amber-500 hover:text-violet-700" />
                    ) : (
                      <FaAngleRight className="hover:text-amber-500" />
                    )}
                  </div>
                )}
              </div>
              {/* Sub-menu items */}
              {/* Transition for submenu */}
              {item.items && item.items.length > 0 && (
                <div
                  className={`border-l-2 border-amber-500 transition-all max-h duration-300 ease-in-out overflow-y-auto overflow-x-clip ${
                    submenuVisibility.value.get(item.id)
                      ? 'max-h-96'
                      : 'max-h-0'
                  }`}
                >
                  {item.items.map((subItem) => (
                    <NavLink
                      end
                      key={subItem.id}
                      onClick={closeMenu}
                      prefetch="intent"
                      to={getNavLinkUrl(subItem)}
                      className="block px-4 py-2 hover:bg-slate-900 hover:scale-105 transition-transform duration-50"
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="relative flex items-center bg-blue-950 text-slate-200 py-4 px-4 top-0 z-10">
      {/* Mobile Header with Logo and Menu Toggle */}
      <div className="flex md:items-center lg:hidden flex-shrink-0">
        <MobileMenu
          menu={menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <NavLink prefetch="intent" to="/" end className="ml-2">
          <img
            src={'/images/CT_Logo_2x2in_v_white.png'}
            alt="Logo"
            className="max-h-12 hover:scale-110"
          />
        </NavLink>
      </div>
      {/* Search Bar - Centered on small screens */}
      <div className="flex flex-1 justify-center w-full flex-shrink mx-4 md:hidden">
        <SearchBar />
      </div>

      {/* Desktop and Larger Screens */}
      <div className="md:flex-1 hidden md:block">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
      </div>
      <div className="hidden hover:scale-105 hover:text-amber-500 transition-all duration-100 lg:flex lg:absolute lg:left-1/2 lg:transform -translate-x-1/2">
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="flex items-center text-lg"
        >
          <img
            src={'/images/CT_Logo_2x2in_v_white.png'}
            alt="Logo"
            className="mr-2 max-h-12"
          />
          <strong>{shop.name}</strong>
        </NavLink>
      </div>

      <div className="flex justify-end items-center">
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}
<div className="text-center sm:text-left"></div>

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className =
    viewport === 'desktop'
      ? 'hidden md:flex md:gap-4 md:ml-4 whitespace-nowrap'
      : 'flex flex-col gap-4';

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  function getNavLinkUrl(itemUrl: string) {
    if (
      itemUrl.includes('myshopify.com') ||
      itemUrl.includes(publicStoreDomain) ||
      itemUrl.includes(primaryDomainUrl)
    ) {
      return new URL(itemUrl).pathname; // Strip the domain for internal links
    }
    return itemUrl;
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // Check for custom URL logic, like "Brands" & "Fandoms"
        const url =
          item.title === 'Brands'
            ? '/brandCollections'
            : item.title === 'Fandoms'
            ? '/fandomCollections'
            : item.title === 'About'
            ? '/about/'
            : getNavLinkUrl(item.url);

        return (
          <div className="relative group" key={item.id}>
            <NavLink
              className="inline-block cursor-pointer font-semibold text-slate-200 text-base"
              end
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              <div className=" hover:scale-105 hover:text-amber-500 transition-all duration-100">
                {item.title}
              </div>
            </NavLink>

            {/* Sub-menu items */}
            {item.items && item.items.length > 0 && (
              <div className="absolute hidden group-hover:flex flex-col bg-gray-800 text-white shadow-md min-w-full -translate-y-px">
                {item.items.map((subItem) => (
                  <NavLink
                    className="submenu-link block px-4 py-2 hover:bg-gray-700"
                    end
                    key={subItem.id}
                    onClick={closeAside}
                    prefetch="intent"
                    style={activeLinkStyle}
                    to={getNavLinkUrl(subItem.url as string)}
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4 ml-auto" role="navigation">
      <div className="hidden md:flex">
        <SearchBar />
      </div>
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className="relative shadow-inner shadow-blue-500 hover:text-amber-500 bg-blue-800 border-gray-600 rounded-full w-8 h-8 flex justify-center items-center hover:scale-105 hover:bg-blue-600 hover:shadow-blue-900 transition-all ease-in-out duration-100 group"
      >
        {isLoggedIn ? (
          <FaUser className=" text-slate-200 group-hover:text-amber-500" />
        ) : (
          <FaSignInAlt className=" text-slate-200 group-hover:text-amber-500" />
        )}
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function SearchBar() {
  const isInputFocused = useSignal(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isInputFocused.value) {
        const searchElement = document.getElementById('search-bar-container');
        // Check if searchElement is not null and if the click is outside the search element
        if (searchElement && !searchElement.contains(event.target as Node)) {
          isInputFocused.value = false;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInputFocused]);

  return (
    <div
      id="search-bar-container"
      className="relative bg-slate-200 rounded-lg w-full hover:scale-105 transition-all duration-100 ease-in-out"
    >
      <form
        className="flex items-center justify-between w-full"
        action="/search"
        method="GET"
      >
        <input
          type="text"
          name="q"
          placeholder="Search..."
          className={`flex-grow transition-all duration-100 ease-in-out ${
            isInputFocused.value ? 'w-36' : 'w-12 md:w-28'
          } bg-transparent text-gray-700 border-none outline-none focus:ring-0 p-2 rounded`}
          onFocus={() => (isInputFocused.value = true)}
        />
        <button
          type="submit"
          className="mx-1 p-2 bg-blue-800 shadow-inner shadow-blue-500 text-slate-200 rounded-lg hover:bg-blue-600 hover:shadow-blue-800 hover:scale-105 transition-all duration-100 ease-in-out hover:text-amber-500"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a
      href="#cart-aside"
      className="relative shadow-inner shadow-blue-500 bg-blue-800 border-gray-600 rounded-full w-8 h-8 flex justify-center items-center hover:scale-105 hover:bg-blue-600 hover:shadow-blue-900 transition-all ease-in-out duration-100 group"
    >
      <FaShoppingCart className="text-xl text-slate-300 group-hover:text-amber-500" />
      {count > 0 && (
        <span className="absolute top-0 left-3/4 transform -translate-x-1/4 -translate-y-1/4 bg-red-600 border border-gray-600 text-slate-200 text-xs font-bold px-1 rounded-full">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    transform: isActive ? 'scale(1.02)' : undefined,
    color: isPending ? '#E5E6F2' : '#E5E6F2',
    textDecoration: isActive ? 'none' : undefined,
  };
}
