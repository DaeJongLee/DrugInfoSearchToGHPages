// App.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useCSVData } from './hooks/useCSVData';
import { useDataFilter } from './hooks/useDataFilter';
import DataTable from './components/DataTable';
import IngredientAnalysis from './components/IngredientAnalysis';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const { data, columns } = useCSVData('/db.csv');
  const [visibleColumns, setVisibleColumns] = useState(['업체명', '제품명', '주성분', '주성분영문', '첨가제']);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState(null);

  const { filteredData, searchTerms, setSearchTerms, excludeTerms, setExcludeTerms } = useDataFilter(data, columns);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);
  const toggleAnalysis = () => setShowAnalysis(!showAnalysis);
  const resetSearch = () => {
    setSearchTerms([{ value: '', type: 'AND' }]);
    setExcludeTerms([{ value: '' }]);
  };

  const openProductList = (ingredient, ingredients) => {
    setSelectedIngredient(ingredient);
    setSelectedIngredients(ingredients);
    setShowProductList(true);
  };

  return (
    <div className="App">
      <h1>의약품 데이터 뷰어</h1>
      <SearchBar
        searchTerms={searchTerms}
        setSearchTerms={setSearchTerms}
        excludeTerms={excludeTerms}
        setExcludeTerms={setExcludeTerms}
        onOpenModal={toggleModal}
        onShowAnalysis={toggleAnalysis}
        onResetSearch={resetSearch}
      />
      <DataTable
        columns={columns.filter(col => visibleColumns.includes(col.name))}
        data={filteredData}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="Additional Information Modal"
      >
        <h2>표시할 열 선택</h2>
        <div>
          {columns.map(column => (
            <div key={column.name}>
              <input
                type="checkbox"
                id={column.name}
                checked={visibleColumns.includes(column.name)}
                onChange={() => {
                  if (visibleColumns.includes(column.name)) {
                    setVisibleColumns(visibleColumns.filter(col => col !== column.name));
                  } else {
                    setVisibleColumns([...visibleColumns, column.name]);
                  }
                }}
              />
              <label htmlFor={column.name}>{column.name}</label>
            </div>
          ))}
        </div>
        <button onClick={toggleModal}>닫기</button>
      </Modal>
      <Modal
        isOpen={showAnalysis}
        onRequestClose={toggleAnalysis}
        contentLabel="Ingredient Analysis Modal"
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto'
          }
        }}
      >
        <IngredientAnalysis data={data} onClose={toggleAnalysis} onShowProducts={openProductList} />
      </Modal>
      <Modal
        isOpen={showProductList}
        onRequestClose={() => setShowProductList(false)}
        contentLabel="Product List Modal"
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto'
          }
        }}
      >
        <ProductList
          data={data}
          ingredient={selectedIngredient}
          ingredients={selectedIngredients}
          onClose={() => setShowProductList(false)}
        />
      </Modal>
    </div>
  );
}

export default App;