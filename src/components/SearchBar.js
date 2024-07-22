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

  const buttonStyles = "px-3 py-1 text-white rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const redButtonStyles = `${buttonStyles} bg-red-500 hover:bg-red-600 focus:ring-red-500`;
  const blueButtonStyles = `${buttonStyles} bg-blue-500 hover:bg-blue-600 focus:ring-blue-500`;
  const greenButtonStyles = `${buttonStyles} bg-green-500 hover:bg-green-600 focus:ring-green-500`;
  const grayButtonStyles = `${buttonStyles} bg-gray-500 hover:bg-gray-600 focus:ring-gray-500`;

  return (
    <div className="space-y-4">
      {searchTerms.map((term, index) => (
        <div key={`search-${index}`} className="flex items-center space-x-2">
          <button onClick={() => removeSearchTerm(index)} className={redButtonStyles}>
            제거
          </button>
          <input
            type="text"
            placeholder={`${index + 1}번째 검색어`}
            value={term.value}
            onChange={(e) => updateSearchTerm(index, e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={term.type}
            onChange={(e) => {
              const newTerms = [...searchTerms];
              newTerms[index].type = e.target.value;
              setSearchTerms(newTerms);
            }}
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          {index === searchTerms.length - 1 && (
            <button onClick={() => addSearchTerm('AND')} className={blueButtonStyles}>
              검색어 추가
            </button>
          )}
        </div>
      ))}

      {excludeTerms.map((term, index) => (
        <div key={`exclude-${index}`} className="flex items-center space-x-2">
          <button
            onClick={() => removeExcludeTerm(index)}
            className={redButtonStyles}
          >
            제거
          </button>
          <input
            type="text"
            placeholder={`제외할 ${index + 1}번째 키워드`}
            value={term.value}
            onChange={(e) => updateExcludeTerm(index, e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {index === excludeTerms.length - 1 && (
            <button onClick={addExcludeTerm} className={blueButtonStyles}>
              제외 키워드 추가
            </button>
          )}
        </div>
      ))}

      <div className="flex space-x-2 mt-4">
        <button onClick={onOpenModal} className={greenButtonStyles}>
          추가 정보
        </button>
        <button onClick={onShowAnalysis} className={greenButtonStyles}>
          성분 분석
        </button>
        <button onClick={onResetSearch} className={grayButtonStyles}>
          검색 초기화
        </button>
      </div>
    </div>
  );
}

export default SearchBar;