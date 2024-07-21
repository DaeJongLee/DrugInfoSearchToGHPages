import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCSVData(url) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch(url);
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
  }, [url]);

  return { data, columns };
}