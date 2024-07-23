import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCSVData(url) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        setIsLoading(true);
        const csvUrl = `${process.env.PUBLIC_URL}${url}`;
        console.log('Fetching CSV from:', csvUrl);
        
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            console.log('Total rows:', results.data.length);
            setData(results.data);
            setColumns(results.meta.fields.map(field => ({
              name: field,
              selector: row => row[field],
              sortable: true,
            })));
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError(error.message);
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchCSV();
  }, [url]);

  return { data, columns, isLoading, error };
}