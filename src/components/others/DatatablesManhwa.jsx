import React from "react";
import { useState } from "react";
import { PrimeReactProvider, PrimeReactContext, FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LINK_API } from '../../utils/config.json';
import { showFormatDatatable } from '../../utils/dataMenu';
import CloseIcon from '@mui/icons-material/Close';


// STYLING
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Box, Button, Grid, IconButton } from "@mui/joy";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ButtonAction from "./ButtonAction";
import { Tag } from "primereact/tag";

function DatatablesManhwa({ isProfile }) {
  const [isData, setIsData] = useState(null)
  const [isFilter, setIsFilter] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    title: {
      operator: FilterOperator.OR,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.CONTAINS
        }
      ]
    },
    "user.displayUsername": {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        }
      ]
    },
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersGetAll = new Headers();
          headersGetAll.append("Content-Type", "application/json");
          headersGetAll.append('Authorization', `Bearer ${parseStorage._token}`);

          const headersOptions = {
            method: 'GET',
            headers: headersGetAll,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/manhwa`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              // toast.success('Data berhasil load!')
              setIsData(result.data);
            })
            .catch((err) => console.error(err))
        } catch (err) {
          console.error(err);
          toast.error('Terjadi kesalahan!');
        }
      }
    }
  }, [setIsData, isProfile]);

  const functionLang = (lang) => {
    switch (lang) {
      case 'kor':
          return 'Korea';
      case 'spa':
          return 'Spanyol';
      case 'chn':
          return 'China';
      case 'eng':
          return 'English';
    }
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters['global'].value = value;
    setIsFilter(_filters);
  }

  const footerDataTemplate = () => {
    return `Total: ${(isData) ? isData.length : 'Loading'} Data`;
  }

  const dateInsertedAt = (data) => {
    return `${showFormatDatatable(data.insertedAt)}`;
  }

  const totalChpAndLang = (data) => {
    return `
      ${data.totalCh} Ch | ${functionLang(data.lang)}
    `
  }

  const rowNumberTemplate = (rowData, column) => {
    const rowIndex = isData.indexOf(rowData) + 1;
    return rowIndex;
  }

  const linkButtonTemplate = (data) => {
    return (
     <>
      <Button 
        href={data.link}
        startDecorator={<OpenInNewIcon fontSize="small" />}
        variant="contained"
        color="primary"
        size="sm"
        target="_blank"
        component="a"
        sx={{
          fontSize: '12px'
        }}
      >
        Open Link
      </Button>
     </> 
    )
  }

  const linkActionTemplate = (data) => {
    return (
      <>
        {(isProfile.displayId === data.user.displayId) ? 
          <ButtonAction 
            data={data}
          /> 
          : <Tag 
              icon={<CloseIcon />}
              className="mr-2"
              value="Not Yours!"
              severity="danger"
            />
        }
      </>
    )
  }

  const value = isFilter["global"] ? isFilter["global"].value : "";
  console.log();
  return (
    <>
      <PrimeReactProvider>
        <Box
          sx={{
            flexGrow: 1
          }}
        >
          <Grid
            container
            spacing={2}
          >
            <Grid
              item="true"
              md={12}
              xs={12}
            >
              <span className="p-input-icon-left">
                <SearchIcon
                style={{ marginTop: '-10px' }} />
                <InputText 
                  type="search"
                  value={value || ""}
                  onChange={(e) => onGlobalFilterChange(e)}
                  placeholder="Search here..."
                  size='small'
                  style={{
                    fontSize: '14px'
                  }}
                />
              </span>
            </Grid>
            <Grid
              item="true"
              md={12}
              xs={12}
            >
              <DataTable
                value={isData}
                paginator
                rows={10}
                removableSort
                filters={isFilter}
                onFilter={(e) => setIsFilter(e.filters)}
                rowsPerPageOptions={[5 ,10, 25, 50, 100]}
                tableStyle={{ minWidth: '50rem' }}
                size="small"
                scrollable scrollHeight="400px"
                footer={footerDataTemplate}
              >
                <Column 
                  header='Nomor'
                  body={rowNumberTemplate}
                  style={{ width: '5%' }}
                  frozen
                />
                <Column 
                  field="title"
                  header="Title"
                  footer="Title"
                  sortable
                  filter
                  style={{ width: '25%', fontWeight: 'bold', fontSize: '14px' }}
                />
                <Column 
                  field="totalCh"
                  header="Total Chp & Lang"
                  footer="Total Chp & Lang"
                  body={totalChpAndLang}
                  style={{ width: '25%' }}
                />
                <Column
                  field="user.displayUsername"
                  header="Staff"
                  footer="Staff"
                  filter
                  sortable
                  style={{ width: '25%' }}
                />
                <Column 
                  field="insertedAt"
                  header="Date Input"
                  footer="Date Input"
                  sortable
                  body={dateInsertedAt}
                  style={{ width: '25%' }}
                />
                <Column 
                  header="Link"
                  footer="Link"
                  body={linkButtonTemplate}
                />
                <Column 
                  header="Action"
                  footer="Action"
                  body={linkActionTemplate}
                />
              </DataTable>
            </Grid>
          </Grid>
        </Box>
      </PrimeReactProvider>
    </>
  )
}

export default DatatablesManhwa;