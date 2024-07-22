  import React from 'react';
  import DataTable from 'react-data-table-component';

  function DataTableComponent({ data, columns }) {
    return (
      <DataTable
        title=" "
        columns={columns}
        data={data}
        pagination
        highlightOnHover
      />
    );
  }

  export default DataTableComponent;