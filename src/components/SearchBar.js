// components/SearchBar.js
import React from 'react';

function SearchBar({ searchTerms, setSearchTerms, excludeTerms, setExcludeTerms, onOpenModal, onShowAnalysis, onResetSearch }) {
  const addSearchTerm = (type) => {
    setSearchTerms([...searchTerms, { value: '', type }]);
  };

  const addExcludeTerm = () => {
    setExcludeTerms([...excludeTerms, { value: '' }]);
  };

  const updateSearchTerm = (index, value) => {
    const newTerms = [...searchTerms];
    newTerms[index].value = value;
    setSearchTerms(newTerms);
  };

  const updateExcludeTerm = (index, value) => {
    const newTerms = [...excludeTerms];
    newTerms[index].value = value;
    setExcludeTerms(newTerms);
  };

  const removeSearchTerm = (index) => {
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
  };

  const removeExcludeTerm = (index) => {
    setExcludeTerms(excludeTerms.filter((_, i) => i !== index));
  };

  return (
    <div>
      {searchTerms.map((term, index) => (
        <div key={`search-${index}`}>
          <input 
            type="text" 
            placeholder={`검색어 ${index + 1}`}
            value={term.value}
            onChange={(e) => updateSearchTerm(index, e.target.value)}
          />
          <select
            value={term.type}
            onChange={(e) => {
              const newTerms = [...searchTerms];
              newTerms[index].type = e.target.value;
              setSearchTerms(newTerms);
            }}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          <button onClick={() => removeSearchTerm(index)}>제거</button>
          {index === searchTerms.length - 1 && (
            <button onClick={() => addSearchTerm('AND')}>검색어 추가</button>
          )}
        </div>
      ))}
      {excludeTerms.map((term, index) => (
        <div key={`exclude-${index}`}>
          <input 
            type="text" 
            placeholder={`제외할 키워드 ${index + 1}`}
            value={term.value}
            onChange={(e) => updateExcludeTerm(index, e.target.value)}
          />
          <button onClick={() => removeExcludeTerm(index)}>제거</button>
          {index === excludeTerms.length - 1 && (
            <button onClick={addExcludeTerm}>제외 키워드 추가</button>
          )}
        </div>
      ))}
      <button onClick={onOpenModal}>추가 정보</button>
      <button onClick={onShowAnalysis}>성분 분석</button>
      <button onClick={onResetSearch}>검색 초기화</button>
    </div>
  );
}

export default SearchBar;