import React, { useMemo, useState, useEffect } from 'react';
import useFetchData from './hooks/useFetchData';
import Card from './components/Card';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const { data, isLoading, error } = useFetchData();

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm === '') {
      return data || [];
    } else {
      return data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [data, searchTerm]);

  const sortData = () => {
    let sorted;
    if (sortAsc) {
      sorted = [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted = [...filteredData].sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedData(sorted);
  };

  useEffect(() => {
    sortData();
  }, [filteredData, sortAsc]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortAsc(!sortAsc); 
    setCurrentPage(1); 
  };

  const pageNumbers = useMemo(() => {
    if (!sortedData) return [];
    return Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, index) => index + 1);
  }, [sortedData, itemsPerPage]);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentItems = useMemo(() => {
    if (!sortedData) return [];
    return sortedData.slice(firstIndex, lastIndex);
  }, [sortedData, currentPage, itemsPerPage, firstIndex, lastIndex]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
      <button onClick={handleSort} style={{ margin: '10px' }}>
        {sortAsc ? 'Sort A-Z' : 'Sort Z-A'}
      </button>
      <div style={{ maxWidth: '50%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '150px' }}>
        <div style={{ width: '100%', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }} className="data-container">
          {currentItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>

        <div style={{ width: 'fit-content', margin: '20px auto', display: 'flex', justifyContent: 'center' }} className="pagination">
          {pageNumbers.map((number) => (
            <button style={{ width: '30px', height: '30px', border: 'none', cursor: 'pointer', background: currentPage === number ? '#333' : 'transparent', color: currentPage === number ? '#fff' : '#333' }} key={number} onClick={() => handlePageClick(number)}>
              {number}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
