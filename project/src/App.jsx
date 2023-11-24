import React, { useMemo, useState, useEffect } from 'react';
import useFetchData from './hooks/useFetchData';
import Card from './components/Card';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); 

  const { data, isLoading, error } = useFetchData(); 

  const pageNumbers = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, index) => index + 1);
  }, [data, itemsPerPage]);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentItems = useMemo(() => {
    if (!data) return [];
    return data.slice(firstIndex, lastIndex);
  }, [data, currentPage, itemsPerPage, firstIndex, lastIndex]);

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
    <div style={{maxWidth: "50%", marginLeft: "auto", marginRight: "auto", paddingTop: "150px"}}>
      <div style={{width: "100%", display: "flex", gap: "150px"}} className="data-container">
        {currentItems.map((item) => (
          <Card key={item.id} item={item} /> 
        ))}
      </div>

      <div style={{width: "170px", marginLeft: "auto", marginRight: "auto", marginTop: "50px",display: "flex", justifyContent: "space-between"}} className="pagination">
        {pageNumbers.map((number) => (
          <button style={{width: "50px", height: "50px", border: "none", cursor: "pointer"}}
            key={number}
            onClick={() => handlePageClick(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
