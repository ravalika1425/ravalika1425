import React, { useEffect, useState, ChangeEvent } from "react";
import style from '../styles/HomePage.module.css'
import { getProperties } from "../services/Api/Property";
import PropertyCard from "./PropertyCard";

interface Property {
  id: number;
  property_type: string;
  status: string;
  price: string;
  address: string;
  district: string;
  mandal: string;
  village: string;
  [key: string]: any;
}

interface Filters {
  property_type?: string;
  status?: string;
  price?: string;
  address?: string;
}

export function Homes() {
  const [data, setData] = useState<Property[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [triggerSearch, setTriggerSearch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties(filters);
        if (response.success) {
          setData(response.data);
        } else {
          setData([]); // Clear the data if no properties are found
        }
        setIsDataFetched(true);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setData([]);
      }
    };

    fetchData();
  }, [triggerSearch]); // Trigger fetch only when search button is clicked

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setTriggerSearch((prev) => !prev); // Toggle triggerSearch to refetch data
  };

  const handleClear = () => {
    setFilters({}); // Reset filters to default
    setTriggerSearch((prev) => !prev); // Trigger fetch for default properties
  };


  return (
    <div className={style.container} style={{paddingTop:'50px'}}>
      <div className={style.searchBar}>
        <select name="property_type" onChange={handleFilterChange} value={filters.property_type || ""}>
          <option value="">All Property Types</option>
          <option value="APARTMENTS">APARTMENTS</option>
          <option value="VILLAS">VILLAS</option>
          <option value="INDIVIDUAL_HOMES">INDIVIDUAL HOMES</option>
          <option value="OPENPLOTS">OPEN PLOTS</option>
          <option value="FORMLANDS">FORMLANDS</option>
        </select>

        <select name="property_status" onChange={handleFilterChange} value={filters.status || ""}>
          <option value="">All Status</option>
          <option value="UNDERCONSTRUCTION">UNDER CONSTRUCTION</option>
          <option value="READYTOOCCUPY">READY TO OCCUPY</option>
        </select>

        <select name="price" onChange={handleFilterChange} value={filters.price || ""}>
          <option value="">All Prices</option>
          <option value="below_20">Below 20 Lakhs</option>
          <option value="50_to_1cr">50 Lakhs to 1 Cr</option>
          <option value="above_1cr">1 Cr Above</option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Search by Address"
          value={filters.address || ""}
          onChange={handleFilterChange}
        />

        <button onClick={handleSearch} className={style.searchButton}>
          Search
        </button>
        <button onClick={handleClear} className={style.clearButton}>
          Clear
        </button>
      </div>

      <div className={style.propertyContainer}>
        {isDataFetched && data.length === 0 ? (
          <p className={style.noResults}>No properties found matching your criteria.</p>
        ) : (
          data.map((item) => <PropertyCard key={item.id} property_obj={item} showButtons={false} />)
        )}
      </div>
      
      {/* </div> */}


    </div>
  );
}

export default Homes; 