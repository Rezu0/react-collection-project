import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import { Button, Grid, IconButton, Sheet, Tooltip, Typography } from "@mui/joy";
import { showFormatDatatable, showFormatDateReadable } from "../../utils/dataMenu";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import RefreshIcon from '@mui/icons-material/Refresh';

function ButtonRefreshData({ 
  setIsDoujinData,
  setIsProfile,
  isProfile 
}) {
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  const onClickRefresh = () => {
    setIsRefreshLoading(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);
  
    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersGetAll = new Headers();
          headersGetAll.append("Content-Type", "application/json");
          headersGetAll.append("Authorization", `Bearer ${parseStorage._token}`);
  
          const headersOptions = {
            method: 'GET',
            headers: headersGetAll,
            redirect: 'follow'
          };
  
          fetch(`${LINK_API}api/doujin`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setTimeout(() => {
                  setIsDoujinData(result.data);
                  setIsRefreshLoading(false);
                  toast.success('Data berhasil diperbarui');
                }, 2000)
              }
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan!')
              setIsRefreshLoading(false);
            });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  return (
    <>
      <Tooltip
        title="Refresh data"
        arrow
        placement="bottom"
      >
        <Button 
          variant="plain"
          color="warning"
          startDecorator={<RefreshIcon />}
          sx={{
            "--Button-gap": "0px",
            padding: '0px 10px',
            marginRight: '5px'
          }}
          onClick={onClickRefresh}
          loading={isRefreshLoading}
        />
      </Tooltip>
    </>
  )
} 

function DatatablesDoujinOwner({ isProfile, setIsProfile }) {
  const [isDoujinData, setIsDoujinData] = useState();
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
          matchMode: FilterMatchMode.CONTAINS
        }
      ]
    },
  });
  const [isLoading, setIsLoading] = useState({
    loading: false,
    id: null
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersGetAll = new Headers();
          headersGetAll.append("Content-Type", "application/json");
          headersGetAll.append("Authorization", `Bearer ${parseStorage._token}`);

          const headersOptions = {
            method: 'GET',
            headers: headersGetAll,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/doujin`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              setIsDoujinData(result.data)
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan!')
            });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [setIsDoujinData, isProfile])

  const rowNumberTemplate = (rowData, column) => {
    const rowIndex = isDoujinData.indexOf(rowData) + 1;
    return rowIndex;
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters["global"].value = value;
    setIsFilter(_filters);
  }

  const onClickHandlerApproved = (data) => {
    setIsLoading(() => ({
      loading: true,
      id: data?.uuid
    }))
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    try {
      if (storedToken) {
        if (parseStorage.state) {
          const headerApproved = new Headers();
          headerApproved.append("Content-Type", "application/json");
          headerApproved.append("Authorization", `Bearer ${parseStorage._token}`);

          const dataApproved = JSON.stringify({
            uuid: data?.uuid
          });

          const requestOptions = {
            method: 'PUT',
            headers: headerApproved,
            body: dataApproved,
            redirect: 'follow'
          }

          fetch(`${LINK_API}api/doujin/approved`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                
                setTimeout(() => {
                  setIsProfile(result.data._user);
                  setIsLoading(() => ({
                    loading: false,
                    id: null
                  }))
                  toast.success(result.message);
                }, 2000);
              }

            }).catch((err) => {
              console.error(err);
              setIsLoading(() => ({
                loading: false,
                id: null
              }))
              toast.error('Terjadi kesalahan saat approved!');
            })
        }
      }
    } catch (err) {
      return;
    }
  }

  const rowTitleTemplate = (data) => {
    let string = data?.title;
    const limitStr = string.substr(0, 50)

    return (
      <>
        <Tooltip
          title={data?.title}
          variant="solid"
          arrow
          placement="top"
        >
          {(data?.approved === 0) ? 
              <Typography>
                {(data?.title.length < 50) ? data?.title : `${limitStr}...`}
              </Typography>
            : 
              <Typography>
                {(data?.title.length < 50) ? data?.title : `${limitStr}...`}
                <IconButton
                  variant="plain"
                  color="success"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Typography>
          }
          
        </Tooltip>
      </>
    )
  }

  const rowTotalPageAndLang = (data) => {
    let lang;
    if (data.lang === 'jp') {
      lang = 'Japan'
    } else {
      lang = 'English'
    }

    return `${data?.totalPage} Page | ${lang}`
  }

  const rowDateInsertedAt = (data) => {
    return (
      <>
        <Tooltip
          title={showFormatDateReadable(data?.insertedAt)}
          variant="solid"
          arrow
          placement="top"
        >
          <Typography>
            {showFormatDatatable(data?.insertedAt)}
          </Typography>
        </Tooltip>
      </>
    );
  }

  const rowLinkButtonTempate = (data) => {
    return (
      <>
        <Button
          href={data?.link}
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

  const rowActionTemplate = (data) => {
    return (
      <>
        {(data?.approved === 0) ?
          <>
            <Tooltip
              title="Approved"
              variant="soft"
              color="warning"
            >
              <Button 
                variant="plain"
                color="success"
                startDecorator={<CheckCircleIcon />}
                sx={{
                  "--Button-gap": "0px",
                  padding: '0px 5px'
                }}
                onClick={() => onClickHandlerApproved(data)}
                loading={(isLoading.id === data?.uuid) ? isLoading.loading : false}
              />
            </Tooltip>
          </>
        : <>

        </>}
      </>
    )
  }

  const value = isFilter["global"] ? isFilter["global"].value : "";

  return (
    <>
      <Sheet
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
          height: 'auto'
        }}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            md={6}
            xs={12}
          >
            <Typography
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '25px'
              }}
            >
              Data Doujin
            </Typography>
          </Grid>

          {/* BOX UNTUK INPUT SEARCH */}
          <Grid
            md={6}
            xs={12}
            marginBottom='20px'
            display='flex'
            justifyContent='end'
          >
            <ButtonRefreshData
              setIsDoujinData={setIsDoujinData}
              setIsProfile={setIsProfile}
              isProfile={isProfile}
            />
            <span className="p-input-icon-left">
              <SearchIcon style={{ marginTop: '-11px' }}/>
              <InputText 
                type="search"
                value={value || ""}
                placeholder="Search here..."
                size='small'
                style={{ fontSize: '14px' }}
                onChange={(e) => onGlobalFilterChange(e)}
              />
            </span>
          </Grid>
        </Grid>

        <DataTable
          value={isDoujinData}
          size="small"
          scrollable
          scrollHeight="500px"
          removableSort
          paginator
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          rows={10}
          filters={isFilter}
          onFilter={(e) => setIsFilter(e.filters)}
        >
          <Column 
            header="Nomor"
            footer="Nomor"
            body={rowNumberTemplate}
            style={{ width: '5%' }}
            frozen
          />
          <Column
            field="title"
            header="Title"
            footer="Title"
            body={rowTitleTemplate}
            sortable
            filter
            filterPlaceholder="Search here..."
            style={{
              width: '30%',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          />
          <Column 
            header="Total Page & Lang"
            footer="Total Page & Lang"
            body={rowTotalPageAndLang}
            style={{
              width: '25%',
              fontSize: '14px'
            }}
          />
          <Column 
            field="user.displayUsername"
            header="Staff"
            footer="Staff"
            sortable
            filter
            filterPlaceholder="Search here..."
            style={{
              width: '20%',
              fontWeight: 'bold'
            }}
          />
          <Column 
            header="Date Input"
            footer="Date Input"
            sortable
            body={rowDateInsertedAt}
            style={{
              width: '25%',
              fontSize: '14px'
            }}
          />
          <Column 
            header="Link"
            footer="Link"
            body={rowLinkButtonTempate}
          />
          <Column 
            header="Action"
            footer="Action"
            body={rowActionTemplate}
          />
        </DataTable>
      </Sheet>
    </>
  )
}

export default DatatablesDoujinOwner;