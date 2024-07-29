// SearchFilter.tsx
import {useSignal} from '@preact/signals-react';

interface SearchFilterProps {
  handleFilterChange: (
    arg0: string,
    arg1: string,
    arg2: boolean,
    arg3: string[],
  ) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({handleFilterChange}) => {
  const vendorFilters = useSignal<string[]>([]);
  const typeFilters = useSignal<string[]>([]);
  const showVendors = useSignal(false);
  const showTypes = useSignal(false);

  const toggleVendors = () => (showVendors.value = !showVendors.value);
  const toggleTypes = () => (showTypes.value = !showTypes.value);

  const handleVendorChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...vendorFilters.value, value]
      : vendorFilters.value.filter((filter) => filter !== value);
    vendorFilters.value = updatedFilters;
    handleFilterChange('vendor', value, isChecked, updatedFilters);
  };

  const handleTypeChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...typeFilters.value, value]
      : typeFilters.value.filter((filter) => filter !== value);
    typeFilters.value = updatedFilters;
    handleFilterChange('type', value, isChecked, updatedFilters);
  };

  const handleAllVendorsChange = (isChecked: boolean) => {
    vendorFilters.value = isChecked ? [] : vendorList;
    handleFilterChange(
      'vendor',
      '',
      isChecked,
      isChecked ? [] : vendorFilters.value,
    );
  };

  const handleAllTypesChange = (isChecked: boolean) => {
    typeFilters.value = isChecked ? [] : typeList;
    handleFilterChange(
      'type',
      '',
      isChecked,
      isChecked ? [] : typeFilters.value,
    );
  };

  return (
    <div>
      {/* Vendor Filter */}
      <div className="block">
        <button
          className="filter-toggle"
          aria-expanded={showVendors.value}
          onClick={toggleVendors}
        >
          Vendor Filter
        </button>
        <div
          className={`checkbox-select ${showVendors.value ? 'show' : 'hide'}`}
        >
          {/* All checkbox */}
          <input
            type="checkbox"
            id="allVendors"
            value=""
            checked={vendorFilters.value.length === 0}
            onChange={(e) => handleAllVendorsChange(e.target.checked)}
          />
          <label htmlFor="allVendors">All</label>
          {/* Individual vendor checkboxes */}
          {vendorList.map((vendor) => (
            <label key={vendor} htmlFor={vendor}>
              <input
                type="checkbox"
                id={vendor}
                value={vendor}
                checked={vendorFilters.value.includes(vendor)}
                onChange={(e) =>
                  handleVendorChange(e.target.value, e.target.checked)
                }
              />
              {vendor}
            </label>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="block">
        <button
          className="filter-toggle"
          aria-expanded={showTypes.value}
          onClick={toggleTypes}
        >
          Type Filter
        </button>
        <div className={`checkbox-select ${showTypes.value ? 'show' : 'hide'}`}>
          {/* All checkbox */}
          <input
            type="checkbox"
            id="allTypes"
            value=""
            checked={typeFilters.value.length === 0}
            onChange={(e) => handleAllTypesChange(e.target.checked)}
          />
          <label htmlFor="allTypes">All</label>
          {/* Individual type checkboxes */}
          {typeList.map((type) => (
            <label key={type} htmlFor={type}>
              <input
                type="checkbox"
                id={type}
                value={type}
                checked={typeFilters.value.includes(type)}
                onChange={(e) =>
                  handleTypeChange(e.target.value, e.target.checked)
                }
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

const vendorList = [
  'Alter',
  'Aniplex',
  'Bandai',
  'Bandai Tamashii Nations',
  'Banpresto',
  'Beeline Creative',
  'Bellfine',
  'Bioworld',
  'cooledtured',
  'DC Direct',
  'Enterbay',
  'Freeing',
  'First 4 Figures',
  'FuRyu',
  'Funko',
  'Good Smile Company',
  'Iron Studios',
  'Kotobukiya',
  'Mattel',
  'McFarlane Toys',
  'Medicom',
  'Megahouse',
  'Ques Q',
  'Salesone Studios',
  'Sega',
  'Sentinel',
  'Taito',
  'Union Creative',
];

const typeList = [
  '1000 Toys',
  'Action & Toy Figures',
  'Board Games',
  'Ceramics',
  'Hats',
  'Socks',
  'Wallet',
  'Plush',
  'Super Premium',
  'FuRyu',
  'Q Posket',
];
