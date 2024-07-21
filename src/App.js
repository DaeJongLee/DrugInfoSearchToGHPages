import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import DataTable from 'react-data-table-component';
import Fuse from 'fuse.js';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [excludeTerm, setExcludeTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(['업체명', '제품명', '주성분', '주성분영문', '첨가제']);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch('/db.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const parsedData = Papa.parse(csv, { header: true });
      
      setData(parsedData.data);
      setColumns(parsedData.meta.fields.map(field => ({
        name: field,
        selector: row => row[field],
        sortable: true,
        omit: !visibleColumns.includes(field),
      })));
    };

    fetchCSV();
  }, [visibleColumns]);

  const fuse = useMemo(() => new Fuse(data, {
    keys: columns.map(col => col.name),
    threshold: 0.3,
  }), [data, columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm && !excludeTerm) return data;

    let result = searchTerm ? fuse.search(searchTerm).map(item => item.item) : data;

    if (excludeTerm) {
      result = result.filter(item => 
        !Object.values(item).some(value => 
          value.toLowerCase().includes(excludeTerm.toLowerCase())
        )
      );
    }

    return result;
  }, [data, searchTerm, excludeTerm, fuse]);

  const openModal = () => {
    setTempVisibleColumns([...visibleColumns]);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleColumnToggle = (column) => {
    if (tempVisibleColumns.includes(column)) {
      setTempVisibleColumns(tempVisibleColumns.filter(col => col !== column));
    } else {
      setTempVisibleColumns([...tempVisibleColumns, column]);
    }
  };

  const saveColumnSettings = () => {
    setVisibleColumns(tempVisibleColumns);
    closeModal();
  };

  return (
    <div className="App">
      <h1>의약품 데이터 뷰어</h1>
      <div>
        <input 
          type="text" 
          placeholder="검색어 입력" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="제외할 키워드 입력" 
          value={excludeTerm}
          onChange={(e) => setExcludeTerm(e.target.value)}
        />
        <button onClick={openModal}>추가 정보</button>
      </div>
      {data.length > 0 ? (
        <DataTable 
          columns={columns.filter(col => visibleColumns.includes(col.name))} 
          data={filteredData}
          pagination
          highlightOnHover
        />
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Additional Information Modal"
      >
        <h2>추가 정보 선택</h2>
        {columns.map(column => (
          <div key={column.name}>
            <input
              type="checkbox"
              id={column.name}
              checked={tempVisibleColumns.includes(column.name)}
              onChange={() => handleColumnToggle(column.name)}
            />
            <label htmlFor={column.name}>{column.name}</label>
          </div>
        ))}
        <button onClick={saveColumnSettings}>저장</button>
        <button onClick={closeModal}>취소</button>
      </Modal>
    </div>
  );
}

export default App;