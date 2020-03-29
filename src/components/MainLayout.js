import 'date-fns';
import React from 'react';

import MUIDataTable from "mui-datatables";

import { theme } from '../theme/theme';
import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';

export class MainLayout extends React.Component {

  render = () => {
    const { data, dataType } = this.props;
    console.log(data, "Pralhad")
    return (
        <MUIDataTable
          columns={StudentService.columns[dataType]}
          data={data}
          icons={GlobalService.tableIcons}
          options={
            {
              headerStyle: {
                color: theme.palette.primary.main
              },
              exportButton: true,
              pageSize: 100,
              showTitle: false,
              selectableRows: 'none',
              toolbar: false,
              filtering: true,
              filter: true,
              filterType: 'doprdown',
              responsive: 'stacked',
            }
          }
        />
    )
  }
}

export default MainLayout;
