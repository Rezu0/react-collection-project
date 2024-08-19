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
import { formatDateForHuman, languageProject, showFormatDatatable, showFormatDateReadable } from "../../utils/dataMenu";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Tag } from "primereact/tag";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Delete } from "@mui/icons-material";
import ModalEditDoujin from "../modal/ModalEditDoujin";
import DialogDeleteDoujin from "../modal/DialogDeleteDoujin";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { countries } from 'country-flag-icons';
import { GB, ID, JP } from "country-flag-icons/react/3x2";

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

          fetch(`${LINK_API}api/doujin/byuser`, headersOptions)
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
          {(data?.approved === 1) ? (
            <IconButton
              variant="plain"
              color="success"
            >
              <CheckCircleIcon />
            </IconButton>
          ) : ''}
        </Typography>
      </Tooltip>
      </>
    )
  }

  const rowTotalLang = (data) => {
    let flag;
  
    // Tentukan bahasa dan ikon bendera yang sesuai
    if (data.lang === 'jp') {
      flag = <JP title="Jepang" style={{ width: '50px' }} />;
    } else {
      flag = <GB title="English" style={{ width: '50px' }} />;
    }

    return (
      <>
        {flag}
      </>
    );
  }
  
  const rowDateInsertedAt = (data) => {
    return (
      <>
        <Tooltip
          title={showFormatDateReadable(data.insertedAt)}
          arrow
          color="success"
          variant="soft"
        >
          <Typography>
            {formatDateForHuman(data.insertedAt)}
          </Typography>
        </Tooltip>
      </>
    );
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
                xs={4}
              >
                <Tooltip
                  title="Edit"
                  variant="soft"
                  color="warning"
                >
                  <IconButton
                    variant="plain"
                    color="primary"
                    size="small"
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
                xs={4}
              >
                <Tooltip
                  title="Delete"
                  variant="soft"
                  color="danger"
                >
                  <IconButton
                    variant="plain"
                    color="danger"
                    size="small"
                    onClick={() => {
                      setIsOpenDelete(true)
                      setIsDataEdit(data);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid
                item="true"
                xs={4}
              >
                <Tooltip
                  title="Copy"
                  variant="soft"
                  color="success"
                >
                  <IconButton
                    variant="plain"
                    size="small"
                    color="success"
                    onClick={async () => {
                      const template = `#${data?.title} #${languageProject(data?.lang)} #${data?.totalPage} Page #${data?.user?.displayUsername}`;

                      await navigator.clipboard.writeText(template)
                        .then(() => toast.success('Copied!', { autoClose: 1000 }))
                        .catch((err) => toast.error('Gagal copy!'));
                      return;
                    }}
                  >
                    <ContentCopyIcon />
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
            display="flex"
            justifyContent="flex-end"
          >
            <span className="p-input-icon-left">
              <SearchIcon 
                style={{ marginTop: '-12px', marginLeft: '7px', color: '#999' }} 
              />
              <InputText 
                type="search"
                value={value || ""}
                placeholder="Search here..."
                style={{
                  fontSize: '14px',
                  paddingLeft: '30px',
                  width: '100%',
                }}
                onChange={(e) => onGlobalFilterChange(e)}
              />
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
              scrollHeight="1000px"
              rows={10}
              removableSort
              filters={isFilter}
              onFilter={(e) => setisFilter(e.filters)}
            >
              <Column 
                header="Nomor"
                body={rowNumberTemplate}
                style={{ width: '5%', zIndex: 1 }}
                frozen
              />

              <Column 
                field="user.displayUsername"
                header="Staff"
                sortable
                filter
                filterPlaceholder="Search staff..."
                style={{
                  width: '10%',
                  fontWeight: 'bold'
                }}
              />

              <Column 
                header="Judul"
                field="title"
                sortable
                filter
                filterPlaceholder="Search..."
                style={{
                  width: '40%',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                body={rowTitleTemplate}
              />

              <Column 
                header="Total Page"
                field="totalPage"
                style={{
                  width: '10%',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              />

              <Column 
                header="Bahasa"
                field="lang"
                body={rowTotalLang}
                style={{
                  width: '10%',
                  fontSize: '14px'
                }}
              />
              
              <Column 
                header="Link"
                body={rowLinkButtonTempate}
                style={{
                  width: '15%'
                }}
              />
              <Column 
                header="Action"
                body={rowActionTemplate}
                style={{
                  width: '25%'
                }}
              />
            </DataTable>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default DatatablesDoujin;