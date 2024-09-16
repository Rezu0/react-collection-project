import { Button, Grid, IconButton, Sheet, Tooltip, Typography } from "@mui/joy";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useEffect } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import { formatDateForHuman, isNew, oktWm, showFormatDatatable, showFormatDateReadable } from "../../utils/dataMenu";
import { Tag } from "primereact/tag";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { CN, ES, GB, KR } from "country-flag-icons/react/3x2";

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

function ButtonRefreshData({
  setIsManhwaData
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

          fetch(`${LINK_API}api/manhwa`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setTimeout(() => {
                  setIsManhwaData(result.data);
                  setIsRefreshLoading(false);
                  toast.success('Data berhasil diperbarui');
                }, 2000)
              }
            }).catch((err) => {
              console.error('Error refresh manhwa: ', err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error(err);
          toast.error('Terjadi kesalahan!');
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
          loading={isRefreshLoading}
          onClick={onClickRefresh}
        />
      </Tooltip>
    </>
  )
}

function DatatablesManhwaOwner({ isProfile, setIsProfile }) {
  const [isManhwaData, setIsManhwaData] = useState();
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

          fetch(`${LINK_API}api/manhwa`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              setIsManhwaData(result.data);
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [setIsManhwaData, isProfile])

  const rowNumberTemplate = (rowData, column) => {
    const rowIndex = isManhwaData.indexOf(rowData) + 1;
    return rowIndex;
  }

  const rowTitleTemplate = (data) => {
    let string = data?.title;
    const limitStr = string.substr(0, 50);

    return (
      <>
        <Tooltip
          title={data?.title}
          variant="solid"
          arrow
          placement="top"
        >
          <Typography>
            {(data?.title.length < 50) ? data?.title : `${limitStr}...`}
          </Typography>
        </Tooltip>
      </>
    )
  }

  const rowTotalPageAndLang = (data) => {
    let flag;

    if (data.lang === 'kor') {
      flag = <KR title="Korea" style={{ width: '50px' }} />
    }

    if (data.lang === 'eng') {
      flag = <GB title="English" style={{ width: '50px' }} />
    }

    if (data.lang === 'chn') {
      flag = <CN title="China" style={{ width: '50px' }} />
    }

    if (data.lang === 'spa') {
      flag = <ES title="Spain" style={{ width: '50px' }} />
    }

    return (
      <>
        {flag}
      </>
    )
  }

  const tagIsNewTemplate = (data) => {
    const isNewFunc = (isNew(data?.isNew) === 'Yes') ? 'success' : 'danger';

    return (
      <>
        <Tag 
          className="mr-2"
          value={isNew(data.isNew)}
          severity={isNewFunc}
        />
      </>
    )
  }

  const oktWmTemplate = (data) => {
    const oktWmFunc = (oktWm(data.oktWm) === 'WM OKT') ? '#0f0f0f' : '#ff0000';
    return (
      <Tag 
        className="mr-2"
        value={oktWm(data.oktWm)}
        style={{
          backgroundColor: oktWmFunc
        }}
      />
    )
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
            {formatDateForHuman(data?.insertedAt)}
          </Typography>
        </Tooltip>
      </>
    )
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

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters["global"].value = value;
    setIsFilter(_filters);
  }

  const onClickHandlerApproved = (data) => {
    if (isLoading?.loading) {
      return;
    }

    setIsLoading(() => ({
      loading: true,
      id: data?.uuid
    }));

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

          fetch(`${LINK_API}api/manhwa/approved`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {

                setTimeout(() => {
                  setIsProfile(result.data._user);
                  setIsLoading(() => ({
                    loading: false,
                    id: null
                  }));
                  toast.success(result.message);
                }, 2000);
              }
            }).catch((err) => {
              setIsLoading(() => ({
                loading: false,
                id: null
              }))
              toast.error('Terjadi kesalahan!');
              console.error('Error cathing approved: ', err);
            })
        }
      }
    } catch (err) {
      console.error(err);
    }
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
                startDecorator={<CloseIcon />}
                sx={{
                  "--button-gap": "0px",
                  paddingLeft: '25px',
                  width: '20px'
                }}
                onClick={() => onClickHandlerApproved(data)}
                loading={(isLoading.id === data?.uuid) ? isLoading.loading : false}
              />
            </Tooltip>
          </>
        :
          <>
            <Button 
              variant="plain"
              color="success"
              startDecorator={<CheckCircleIcon />}
              sx={{
                "--button-gap": "0px",
                  paddingLeft: '25px',
                  width: '20px'
              }}
            />
          </>
        }
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
              Data Manhwa
            </Typography>
          </Grid>

          <Grid
            md={6}
            xs={12}
            marginBottom='20px'
            display='flex'
            justifyContent='flex-end'
          >
            <ButtonRefreshData 
              setIsManhwaData={setIsManhwaData}
            />
            <span className="p-input-icon-left">
              <SearchIcon style={{ marginTop: '-12px', marginLeft: '7px', color: '#999' }} />
              <InputText 
                type="search"
                value={value || ""}
                placeholder="Search here..."
                size='small'
                style={{ 
                  fontSize: '14px',
                  paddingLeft: '30px',
                  width: '100%',
                }}
                onChange={onGlobalFilterChange}
              />
            </span>
          </Grid>
        </Grid>
        <DataTable
          value={isManhwaData}
          size="small"
          scrollable
          scrollHeight="1000px"
          removableSort
          paginator
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          tableStyle={{ minWidth: '60rem' }}
          rows={10}
          filters={isFilter}
          onFilter={(e) => setIsFilter(e.filters)}
        >
          <Column 
            header="Nomor"
            body={rowNumberTemplate}
            style={{ width: '5%' }}
            frozen
          />

          <Column 
            field="user.displayUsername"
            header="Staff"
            filter
            filterPlaceholder="Search here..."
            style={{
              width: '10%',
              fontWeight: 'bold'
            }}
          />

          <Column 
            field="title"
            header="Title"
            body={rowTitleTemplate}
            sortable
            filter
            filterPlaceholder="Search here..."
            style={{
              width: '35%',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          />

          <Column 
            field="totalCh"
            header="Total Chapter"
            style={{
              width: '10%',
              fontSize: '14px',
              textAlign: 'center'
            }}
          />

          <Column 
            header="Bahasa"
            body={rowTotalPageAndLang}
            headerStyle={{ textAlign: 'center' }}
            // bodyStyle={{ textAlign: 'center' }}
            style={{
              width: '8%',
              fontSize: '14px',
            }}
          />

          <Column 
            field="isNew"
            header="Is New?"
            body={tagIsNewTemplate}
            style={{ fontSize: '14px', width: '8%' }}
          />

          <Column 
            field="oktWm"
            header="NO WM/WM OKT"
            body={oktWmTemplate}
            style={{
              width: '10%',
              fontSize: '14px'
            }}
          />

          <Column 
            header="Link"
            body={rowLinkButtonTempate}
          />

          <Column 
            header="Action"
            field="approved"
            sortable
            body={rowActionTemplate}
          />
        </DataTable>
      </Sheet>
    </>
  )
}

export default DatatablesManhwaOwner;
