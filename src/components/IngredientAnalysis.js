import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';

function IngredientAnalysis({ data, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const ingredientDistribution = useMemo(() => {
    const distribution = {};
    data.forEach(item => {
      const ingredients = item.주성분.split('/').map(i => i.trim());
      ingredients.forEach(ingredient => {
        distribution[ingredient] = (distribution[ingredient] || 0) + 1;
      });
    });
    return Object.entries(distribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const ingredientCombinations = useMemo(() => {
    const combinations = {};
    data.forEach(item => {
      const ingredients = item.주성분.split('/').map(i => i.trim());
      if (ingredients.length > 1) {
        const combo = ingredients.sort().join(' + ');
        combinations[combo] = (combinations[combo] || 0) + 1;
      }
    });
    return Object.entries(combinations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const filteredIngredients = ingredientDistribution.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCombinations = ingredientCombinations.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: '성분명',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: '빈도',
      selector: row => row.count,
      sortable: true,
    },
  ];

  return (
    <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
      <h2>성분 분석</h2>
      <input
        type="text"
        placeholder="검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '100%', padding: '10px' }}
      />
      <h3>개별 성분 분포</h3>
      <DataTable
        columns={columns}
        data={filteredIngredients}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
      <h3>성분 조합</h3>
      <DataTable
        columns={columns}
        data={filteredCombinations}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
      <button onClick={onClose} style={{ marginTop: '20px' }}>닫기</button>
    </div>
  );
}

export default IngredientAnalysis;