import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

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
      })));
    };

    fetchCSV();
  }, []);

  return (
    <div className="App">
      <h1>의약품 데이터 뷰어</h1>
      {data.length > 0 ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <p>데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default App;