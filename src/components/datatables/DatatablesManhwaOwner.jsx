import { Button, Grid, Sheet, Tooltip, Typography } from "@mui/joy";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useEffect } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import { formatDateForHuman, isNew, showFormatDatatable, showFormatDateReadable } from "../../utils/dataMenu";
import { Tag } from "primereact/tag";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FilterMatchMode, FilterOperator } from "primereact/api";

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
    return `${data?.totalCh} Ch | ${functionLang(data?.lang)}`;
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
              <SearchIcon style={{ marginTop: '-11px' }} />
              <InputText 
                type="search"
                value={value || ""}
                placeholder="Search here..."
                size='small'
                style={{ fontSize: '14px' }}
                onChange={onGlobalFilterChange}
              />
            </span>
          </Grid>
        </Grid>
        <DataTable
          value={isManhwaData}
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
            field="isNew"
            header="Is New?"
            footer="Is New?"
            body={tagIsNewTemplate}
            sortable
            style={{ fontSize: '14px' }}
          />

          <Column 
            field="insertedAt"
            header="Date Input"
            footer="Date Input"
            body={rowDateInsertedAt}
            sortable
            style={{ width: '25%', fontSize: '14px' }}
          />

          <Column 
            header="Link"
            footer="Link"
            body={rowLinkButtonTempate}
          />
        </DataTable>
      </Sheet>
    </>
  )
}

export default DatatablesManhwaOwner;
