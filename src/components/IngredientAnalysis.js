// components/IngredientAnalysis.js
import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';

function IngredientAnalysis({ data, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const ingredientDistribution = useMemo(() => {
    const distribution = {};
    data.forEach(item => {
      const ingredients = item.주성분.split('/').map(i => i.trim());
      ingredients.forEach(ingredient => {
        distribution[ingredient] = distribution[ingredient] || { count: 0, products: [] };
        distribution[ingredient].count += 1;
        distribution[ingredient].products.push(item);
      });
    });
    return Object.entries(distribution)
      .map(([name, { count, products }]) => ({ name, count, products }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const ingredientCombinations = useMemo(() => {
    const combinations = {};
    data.forEach(item => {
      const ingredients = item.주성분.split('/').map(i => i.trim());
      if (ingredients.length > 1) {
        const combo = ingredients.sort().join(' + ');
        combinations[combo] = combinations[combo] || { count: 0, products: [] };
        combinations[combo].count += 1;
        combinations[combo].products.push(item);
      }
    });
    return Object.entries(combinations)
      .map(([name, { count, products }]) => ({ name, count, products }))
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
    {
      name: '제품 목록',
      cell: row => (
        <button onClick={() => {
          setSelectedIngredient(row);
          setShowProductList(true);
        }}>
          제품 목록 보기
        </button>
      ),
    },
  ];

  const productListColumns = [
    { name: '업체명', selector: row => row.업체명, sortable: true },
    { name: '제품명', selector: row => row.제품명, sortable: true },
    { name: '주성분', selector: row => row.주성분, sortable: true },
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

      <Modal
        isOpen={showProductList}
        onRequestClose={() => setShowProductList(false)}
        contentLabel="Product List Modal"
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto'
          }
        }}
      >
        <h2>{selectedIngredient?.name} 포함 제품 목록 (총 {selectedIngredient?.count}개)</h2>
        <DataTable
          columns={productListColumns}
          data={selectedIngredient?.products || []}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
        />
        <button onClick={() => setShowProductList(false)} style={{ marginTop: '20px' }}>닫기</button>
      </Modal>
    </div>
  );
}

export default IngredientAnalysis;