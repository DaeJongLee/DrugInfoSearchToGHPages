// hooks/useDataFilter.js
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export function useDataFilter(data, columns) {
  const [searchTerms, setSearchTerms] = useState([{ value: '', type: 'AND' }]);
  const [excludeTerms, setExcludeTerms] = useState([{ value: '', type: 'AND' }]);

  const fuse = useMemo(() => new Fuse(data, {
    keys: columns.map(col => col.name),
    threshold: 0.3,
  }), [data, columns]);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search terms
    searchTerms.forEach(term => {
      if (term.value) {
        const searchResult = fuse.search(term.value).map(item => item.item);
        if (term.type === 'AND') {
          result = result.filter(item => searchResult.includes(item));
        } else {
          result = [...new Set([...result, ...searchResult])];
        }
      }
    });

    // Apply exclude terms
    excludeTerms.forEach(term => {
      if (term.value) {
        result = result.filter(item => 
          !Object.values(item).some(value => 
            value.toLowerCase().includes(term.value.toLowerCase())
          )
        );
      }
    });

    return result;
  }, [data, searchTerms, excludeTerms, fuse]);

  return { filteredData, searchTerms, setSearchTerms, excludeTerms, setExcludeTerms };
}
