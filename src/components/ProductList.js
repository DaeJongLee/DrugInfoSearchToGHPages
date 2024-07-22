import React from 'react';
import DataTable from 'react-data-table-component';

function ProductList({ data, ingredient, onClose }) {
  const filteredData = data.filter(item => 
    item.주성분.toLowerCase().includes(ingredient.toLowerCase())
  );

  const columns = [
    { name: '제품명', selector: row => row.제품명, sortable: true },
    { name: '업체명', selector: row => row.업체명, sortable: true },
    { name: '주성분', selector: row => row.주성분, sortable: true },
    // 필요한 다른 열들을 여기에 추가
  ];

  return (
    <div>
      <h2>{ingredient} 포함 제품 목록</h2>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
      <button onClick={onClose} style={{ marginTop: '20px' }}>닫기</button>
    </div>
  );
}

export default ProductList;