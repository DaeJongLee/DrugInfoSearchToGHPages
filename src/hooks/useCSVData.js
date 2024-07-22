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
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const parsedData = Papa.parse(csv, { header: true });
        
        console.log('Parsed data:', parsedData.data.slice(0, 5)); // Log first 5 rows
        console.log('Columns:', parsedData.meta.fields);

        setData(parsedData.data);
        setColumns(parsedData.meta.fields.map(field => ({
          name: field,
          selector: row => row[field],
          sortable: true,
        })));
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCSV();
  }, [url]);

  return { data, columns, isLoading, error };
}