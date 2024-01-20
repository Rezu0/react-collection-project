import { DataTable } from "primereact/datatable";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import { Column } from "primereact/column";
import { Box, Button, Grid, IconButton, Tooltip, Typography } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { showFormatDatatable } from "../../utils/dataMenu";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Tag } from "primereact/tag";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from "@mui/icons-material";
import ModalEditDoujin from "../modal/ModalEditDoujin";
import DialogDeleteDoujin from "../modal/DialogDeleteDoujin";

function DatatablesDoujin({ isProfile, setIsProfile }) {
  const [isDataTable, setIsDataTable] = useState();
  const [isFilter, setisFilter] = useState({
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
  });
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isDataEdit, setIsDataEdit] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

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
              setIsDataTable(result.data);
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan saat get data!');
            })
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [setIsDataTable, isProfile]);

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters['global'].value = value;
    setisFilter(_filters);
  }

  const onClickJustMe = () => {
    let _filters = { ...isFilter };

    _filters['global'].value = isProfile.displayUsername;
    setisFilter(_filters);
  }

  const rowNumberTemplate = (rowData, column) => {
    const rowIndex = isDataTable.indexOf(rowData) + 1;
    return rowIndex;
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
        <Typography>
          {(data?.title.length < 50) ? data?.title : `${limitStr}...`}
          <Badge value="👍"></Badge>
        </Typography>
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
    return `${data?.totalPage} Page | ${lang}`;
  }

  const rowDateInsertedAt = (data) => {
    return `${showFormatDatatable(data.insertedAt)}`;
  }

  const rowLinkButtonTempate = (data) => {
    return (
      <>
        <Button
          href={data.link}
          startDecorator={<OpenInNewIcon fontSize="small"/>}
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
        {(isProfile.displayId === data?.user.displayId) ?
          <>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item="true"
                xs={6}
              >
                <Tooltip
                  title="Edit"
                  variant="soft"
                  color="warning"
                >
                  <IconButton
                    variant="plain"
                    color="primary"
                    onClick={() => {
                      setIsOpenModalEdit(true);
                      setIsDataEdit(data);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid
                item="true"
                xs={6}
              >
                <Tooltip
                  title="Delete"
                  variant="soft"
                  color="danger"
                >
                  <IconButton
                    variant="plain"
                    color="danger"
                    onClick={() => {
                      setIsOpenDelete(true)
                      setIsDataEdit(data);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </> :
          <>
            <Tag 
              icon={<CloseIcon />}
              className="mr-2"
              value="Not Yours!"
              severity="danger"
            />
          </>
        }
      </>
    )
  }

  const value = isFilter["global"] ? isFilter["global"].value : "";

  return (
    <>
      {/* INI MODAL UNTUK EDIT DOUJIN */}
      {(isDataEdit != null) ? (
        <>
          <ModalEditDoujin 
            isOpenModalEdit={isOpenModalEdit}
            setIsOpenModalEdit={setIsOpenModalEdit}
            isDataEdit={isDataEdit}
            setIsProfile={setIsProfile}
          />
        </>
      ) : ''}

      {/* INI MODAL UNTUK DIALOG HAPUS DOUJIN */}
      {(isDataEdit != null) ? (
        <>
          <DialogDeleteDoujin 
            isOpenDelete={isOpenDelete}
            setIsOpenDelete={setIsOpenDelete}
            isDataDelete={isDataEdit}
            setIsProfie={setIsProfile}
          />
        </>
      ) : ''}

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
                style={{ marginTop: '-10px' }}
              />
              <InputText 
                type="search"
                value={value || ""}
                placeholder="Search here..."
                size='small'
                style={{
                  fontSize: '14px'
                }}
                onChange={(e) => onGlobalFilterChange(e)}
              />
              <Button
                sx={{
                  marginLeft: '10px'
                }}
                color="warning"
                variant="soft"
                onClick={onClickJustMe}
              >
                Just Me!
              </Button>
            </span>
          </Grid>
          <Grid
            item="true"
            md={12}
            xs={12}
          >
            <DataTable
              value={isDataTable}
              paginator
              rowsPerPageOptions={[5, 10, 25, 50 , 100]}
              tableStyle={{ minWidth: '50rem' }}
              size="small"
              scrollable
              scrollHeight="400px"
              rows={10}
              removableSort
              filters={isFilter}
              onFilter={(e) => setisFilter(e.filters)}
            >
              <Column 
                header="Nomor"
                footer="Nomor"
                body={rowNumberTemplate}
                style={{ width: '5%' }}
                frozen
              />
              <Column 
                header="Title"
                footer="Title"
                field="title"
                sortable
                filter
                filterPlaceholder="Search..."
                style={{
                  width: '30%',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                body={rowTitleTemplate}
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
                style={{
                  width: '20%',
                  fontWeight: 'bold'
                }}
              />
              <Column 
                field="insertedAt"
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
                style={{
                  width: '25%'
                }}
              />
              <Column 
                header="Action"
                footer="Action"
                body={rowActionTemplate}
              />
            </DataTable>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default DatatablesDoujin;