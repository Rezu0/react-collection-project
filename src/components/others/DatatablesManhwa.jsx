import React from "react";
import { useState } from "react";
import { PrimeReactProvider, PrimeReactContext, FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { LINK_API } from '../../utils/config.json';
import { showFormatDatatable, isNew, showFormatDateReadable, showFormattedDate, formatDateForHuman, languageProject, oktWm } from '../../utils/dataMenu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


// STYLING
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Box, Button, Grid, IconButton, Link, Tooltip, Typography } from "@mui/joy";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Tag } from "primereact/tag";
import ModalEditManhwa from "../modal/ModalEditManhwa";
import DialogDeleteManhwa from "../modal/DialogDeleteManhwa";
import { CN, ES, GB, KR } from "country-flag-icons/react/3x2";

function DatatablesManhwa({ isProfile, setIsProfile }) {
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isClickData, setIsClickData] = useState(null);

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

          fetch(`${LINK_API}api/manhwa/byuser`, headersOptions)
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

  const totalChpAndLang = (data) => {
    let flag;
  
    // Tentukan bahasa dan ikon bendera yang sesuai
    if (data.lang === 'kor') {
      flag = <KR title="Korea" style={{ width: '50px' }} />;
    }

    if (data.lang === 'eng') {
      flag = <GB title="English" style={{ width: '50px' }} />;
    }

    if (data.lang === 'chn') {
      flag = <CN title="China" style={{ width: '50px' }} />;
    }

    if (data.lang === 'spa') {
      flag = <ES title="Spain" style={{ width: '50px' }} />;
    }

    return (
      <>
        {flag}
      </>
    );
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
          fontSize: '12px',
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
        <>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item="true"
              xs={4}
            >
              <Tooltip title="Edit" variant="soft" color="warning">
                <IconButton
                  variant="plain"
                  color="primary"
                  onClick={() => {
                    setIsOpenModal(true);
                    setIsClickData(data);
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
              <Tooltip title="Delete" variant="soft" color="danger">
                <IconButton
                  variant="plain"
                  color="danger"
                  onClick={() => {
                    setIsOpenDelete(true)
                    setIsClickData(data)
                  }}
                >
                  <DeleteIcon />
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
                      let tags = [];

                      if (data?.isNew === 1) {
                        tags.push("#New");
                      }

                      if (data?.oktWm === 1) {
                        tags.push("#OKT");
                      }

                      if (data?.oktWm === 2) {
                        tags.push('#CLEAR');
                      }

                      tags.push(`#${data?.title}`);
                      tags.push(`#${languageProject(data?.lang)}`);
                      tags.push(`#${data?.totalCh} Chapter`);
                      tags.push(`#${data?.user?.displayUsername}`);

                      const template = tags.join(" ");

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

        </>
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

  const tagIsNewTemplate = (data) => {
    const isNewFunc = (isNew(data.isNew) === 'Yes') ? 'success' : 'danger';
    return (
      <Tag 
        className="mr-2"
        value={isNew(data.isNew)}
        severity={isNewFunc}
      />
    )
  }

  const oktWmTemplate = (data) => {
    // const oktWmFunc = (oktWm(data.oktWm) === 'WM OKT') ? '#0f0f0f' : '#ff0000';
    let oktWmFunc;

    if (oktWm(data.oktWm) === 'WM OKT') {
      oktWmFunc = '#0f0f0f';
    } else if (oktWm(data.oktWm) === 'CLEAN OKT') {
      oktWmFunc = '#9333ea';
    } else {
      oktWmFunc = '#ff0000';
    }

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
            {(data?.approved === 1) ? 
              <CheckCircleIcon color="success"/>
            : ''}
          </Typography>
        </Tooltip>
      </>
    )
  }

  const value = isFilter["global"] ? isFilter["global"].value : "";

  return (
    <>
      {/* INI MODAL UNTUK EDIT INFORMATION DATA */}
      {(isClickData !== null) ? (
        <>
          <ModalEditManhwa 
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            isDataModal={isClickData}
            setIsProfile={setIsProfile}
          />
        </>
      ) : ''}

      {/* INI MODAL UNTUK DIALOG DELETE INFORMATION DATA */}
      {(isClickData !== null) ? (
        <>
          <DialogDeleteManhwa 
            isOpenDelete={isOpenDelete}
            setIsOpenDelete={setIsOpenDelete}
            isData={isClickData}
            setIsProfile={setIsProfile}
          />
        </>
      ) : ''}

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
              display='flex'
              justifyContent='flex-end'
            >
              <span className="p-input-icon-left">
                <SearchIcon
                  style={{ marginTop: '-12px', marginLeft: '7px', color: '#999' }} />
                <InputText 
                  type="search"
                  value={value || ""}
                  onChange={(e) => onGlobalFilterChange(e)}
                  placeholder="Search here..."
                  size='small'
                  style={{
                    fontSize: '14px',
                    paddingLeft: '30px',
                    width: '100%',
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
                tableStyle={{ minWidth: '70rem' }}
                size="small"
                scrollable
                scrollHeight="1000px"
                footer={footerDataTemplate}
              >
                <Column 
                  header='Nomor'
                  body={rowNumberTemplate}
                  style={{ width: '5%' }}
                  frozen
                />

                <Column
                  field="user.displayUsername"
                  header="Staff"
                  filter
                  sortable
                  filterPlaceholder="Search staff..."
                  style={{
                    width: '8%',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                />

                <Column 
                  field="title"
                  header="Judul"
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
                  body={totalChpAndLang}
                  style={{
                    width: '5%',
                    fontSize: '14px'
                  }}
                />

                <Column 
                  field="isNew"
                  header="New/Tidak?"
                  sortable
                  body={tagIsNewTemplate}
                  style={{
                    width: '5%',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}
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
                  body={linkButtonTemplate}
                  style={{
                    width: '12%'
                  }}
                />

                <Column 
                  header="Action"
                  body={linkActionTemplate}
                  style={{
                    width: '10%'
                  }}
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