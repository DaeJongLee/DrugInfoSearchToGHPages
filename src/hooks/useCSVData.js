import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCSVData(url) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      const possiblePaths = [
        `${process.env.PUBLIC_URL}${url}`,
        `${process.env.PUBLIC_URL}/DrugInfoSearchToGHPages${url}`,
        url,
        `/DrugInfoSearchToGHPages${url}`,
      ];

      for (const path of possiblePaths) {
        try {
          setIsLoading(true);
          console.log('Attempting to fetch CSV from:', path);
          const response = await fetch(path);
          if (!response.ok) {
            console.log(`Failed to fetch from ${path}, trying next path...`);
            continue;
          }
          const reader = response.body.getReader();
          const result = await reader.read();
          const decoder = new TextDecoder('utf-8');
          const csv = decoder.decode(result.value);
          const parsedData = Papa.parse(csv, { header: true });
          
          console.log('Parsed data:', parsedData.data.slice(0, 5));
          console.log('Columns:', parsedData.meta.fields);

          setData(parsedData.data);
          setColumns(parsedData.meta.fields.map(field => ({
            name: field,
            selector: row => row[field],
            sortable: true,
          })));
          setIsLoading(false);
          return; // 성공적으로 데이터를 가져왔으므로 함수 종료
        } catch (error) {
          console.error(`Error fetching CSV from ${path}:`, error);
        }
      }

      // 모든 경로를 시도한 후에도 실패한 경우
      setError('Failed to load CSV file from all possible paths');
      setIsLoading(false);
    };

    fetchCSV();
  }, [url]);

  return { data, columns, isLoading, error };
}