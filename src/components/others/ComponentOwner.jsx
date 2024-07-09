import { Box, Button, Grid, Modal, ModalClose, Sheet, Tooltip, Typography } from "@mui/joy";
import React from "react";
import DatatablesDoujinOwner from "../datatables/DatatablesDoujinOwner";
import DatatablesManhwaOwner from "../datatables/DatatablesManhwaOwner";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StorageIcon from '@mui/icons-material/Storage';
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import { formatDateForHuman, formatToCurrency, formatViaWithdraw, showFormatDateReadable, formatDivisiStaff } from "../../utils/dataMenu";
import { Tag } from "primereact/tag";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import RefreshListWithdraw from "./RefreshListWithdraw";
import { handlerFetchingAllSaldoStaff } from '../../utils/handler-fetching';
import DialogProveProject from "../modal/DialogProveProject";

function ComponentOwner({ isProfile, setIsProfile }) {
  const [isModalRequest, setIsModalRequest] = useState(false);
  const [isModalSaldo, setIsModalSaldo] = useState(false);
  const [isRequestData, setIsRequestData] = useState();
  const [isAllSaldo, setIsAllSaldo] = useState();
  const [isDialogProve, setIsDialogProve] = useState(false);
  const [isSendToDialog, setIsSendToDialog] = useState();
  const [isLoadingDetail, setIsLoadingDetail] = useState({
    loading: false,
    id: null,
  });
  const [isLoadingDone, setIsLoadingDone] = useState({
    loading: false,
    id: null
  });
  const [isFilter, setIsFilter] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    via: {
      operator: FilterOperator.OR,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS
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
    }
  });
  const [isFilterSaldo, setIsFilterSaldo] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    displayUsername: {
      operator: FilterOperator.AND,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.CONTAINS
        }
      ]
    },
    divisi: {
      operator: FilterOperator.OR,
      constraints: [
        {
          value: null,
          matchMode: FilterMatchMode.EQUALS
        }
      ]
    },
  });
  const [via] = useState([
    'DANA',
    'OVO',
    'GOPAY',
    'Shopee Pay'
  ]);
  const [divisi] = useState([
    'manhwa',
    'doujin',
  ]);

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

          fetch(`${LINK_API}api/admin/withdraw`, headersOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setIsRequestData(result.data);
              }
            }).catch((err) => {
              console.error('Error list withdraw: ', err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error('Error catching: ', err);
          toast.error('Terjadi kesahalan!');
        }
      }
    }
  }, [setIsRequestData, isProfile])

  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        const responseAllSaldoStaff = async () => {
          const response = await handlerFetchingAllSaldoStaff(parseStorage._token);
          return {
            status: response.status,
            message: response.message,
            data: response.data
          }
        }; 

        responseAllSaldoStaff().then((response) => {
          if (response.status) {
            if (response.status === 'fail') {
              console.error(response.message);
            }

            if (response.status === 'success') {
              setIsAllSaldo(response.data);
            }
          }
        }).catch((err) => {
          console.error(err);
          toast.error('Terjadi kesalahan');
        })
      }
    }
  }, [setIsAllSaldo, isProfile])

  // ROW UNTUK ALL SALDO STAFF
  const rowNumberSaldo = (row, column) => {
    const rowIndex = isAllSaldo.indexOf(row) + 1;
    return rowIndex;
  }

  const onGlobalFilterSaldoChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilterSaldo };

    _filters["global"].value = value;
    setIsFilterSaldo(_filters);
  }

  const divisiItemTemplate = (option) => {
    return (
      <>
        <Tag 
          value={option}
          style={{
            backgroundColor: `${formatDivisiStaff(option).colorBtn}`
          }}
        />
      </>
    )
  }

  const divisiFilterTemplate = (options) => {
    return (
      <Dropdown 
        value={options.value}
        options={divisi}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={divisiItemTemplate}
        placeholder="Select one..."
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    )
  }

  const rowDivisiTemplate = (data) => {
    const formatedDivisi = formatDivisiStaff(data?.divisi);
    return (
      <>
        <Tag 
          value={formatedDivisi.divisi}
          style={{
            backgroundColor: `${formatedDivisi.colorBtn}`
          }}
        />
      </>
    )
  }

  const rowSaldoStaffTemplate = (data) => {
    return `${formatToCurrency(data.saldo[0].amount)}`;
  }

  const rowLastWithdrawTemplate = (data) => {
    return (
      <>
      {(data.saldo[0].lastWithdraw === '') ? 'Invalid Date' : 
        <>
          <Tooltip
            title={showFormatDateReadable(data.saldo[0].lastWithdraw)}
            arrow
            placement="top"
          >
            <Typography>
              {formatDateForHuman(data.saldo[0].lastWithdraw)}
            </Typography>
          </Tooltip>
        </>
      }
      </>
    )
  }

  const handlerClickDetailProject = (data) => {
    if (isLoadingDetail.loading) {
      return;
    }

    setIsSendToDialog(data);
    setIsLoadingDetail({
      loading: true,
      id: data?.displayId
    });

    setTimeout(() => {
      setIsDialogProve(true);
      setIsLoadingDetail({
        loading: false,
        id: null
      });
    }, 1000)
  }

  const rowButtonSaldoStaff = (data) => {
    return (
      <>
        <Tooltip
          title="Bukti Project"
          variant="soft"
          color="danger"
          arrow
          placement="right"
        >
          <Button
            variant="solid"
            color="primary"
            sx={{
              padding: '0 10px',
              fontSize: '13px'
            }}
            loading={(isLoadingDetail.id === data?.displayId) ? isLoadingDetail.loading : false}
            onClick={() => handlerClickDetailProject(data)}
          >
            Detail Project
          </Button>
        </Tooltip>
      </>
    )
  }

  // END ROW UNTUK ALL SALDO STAFF

  // ROW UNTUK LIST WITHDRAW

  const rowNumberTemplate = (row, column) => {
    const rowIndex = isRequestData.indexOf(row) + 1;
    return rowIndex;
  }

  const rowSaldoTemplate = (data) => {
    return `${formatToCurrency(data.amount)}`;
  }

  const rowViaTemplate = (data) => {
    const formatedVia = formatViaWithdraw(data?.via);
    return (
      <>
        <Tag 
          value={formatedVia.via}
          style={{
            backgroundColor: `${formatedVia.colorBtn}`
          }}
        />
      </>
    )
  }

  const viaItemTemplate = (option) => {
    return (
      <>
        <Tag 
          value={option}
          style={{
            backgroundColor: `${formatViaWithdraw(option).colorBtn}`
          }}
        />
      </>
    )
  }

  const rowDateWithdraw = (data) => {
    return (
      <>
        <Tooltip
          title={showFormatDateReadable(data?.dateWithdraw)}
          arrow
          placement="top"
        >
          <Typography>
            {formatDateForHuman(data?.dateWithdraw)}
          </Typography>
        </Tooltip>
      </>
    )
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...isFilter };

    _filters["global"].value = value;
    setIsFilter(_filters);
  }

  const onClickButtonDone = (data) => {
    if (isLoadingDone.loading) {
      return;
    }

    setIsLoadingDone({
      loading: true,
      id: data?.uuid
    });

    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    if (storedToken) {
      if (parseStorage.state) {
        try {
          const headersDone = new Headers();
          headersDone.append("Content-Type", "application/json");
          headersDone.append("Authorization", `Bearer ${parseStorage._token}`);

          const dataRaw = JSON.stringify({
            uuid: data?.uuid
          });

          const requestOptions = {
            method: 'PUT',
            headers: headersDone,
            body: dataRaw,
            redirect: 'follow'
          };

          fetch(`${LINK_API}api/admin/withdraw`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setTimeout(() => {
                  setIsRequestData(result.data);
                  toast.success(result.message);
                  setIsLoadingDone({
                    loading: false,
                    id: null
                  });
                }, 2000);
              }
            }).catch((err) => {
              console.error(err);
              toast.error('Terjadi kesalahan!');
            })
        } catch (err) {
          console.error(err);
          toast.error('Terjadi kesalahan!');
        }
      }
    }
  }

  const rowButtonAction = (data) => {
    return (
      <>
        <Button
          variant="solid"
          startDecorator={<CheckCircleIcon fontSize="small" />}
          color="success"
          sx={{
            "--Button-gap": "2px",
            padding: '0 10px',
            fontSize: '13px'
          }}
          onClick={() => onClickButtonDone(data)}
          loading={(isLoadingDone.id === data?.uuid) ? isLoadingDone.loading : false}
        >
          Done
        </Button>
      </>
    )
  }

  const viaRowFilterTemplate = (options) => {
    return (
      <Dropdown 
        value={options.value}
        options={via}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={viaItemTemplate}
        placeholder="Select one..."
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    )
  }

  // END ROW UNTUK LIST WITHDRAW

  const value = isFilter["global"] ? isFilter["global"].value : "";
  const valueSaldo = isFilterSaldo["global"] ? isFilterSaldo["global"].value : "";

  return (
    <>
    <DialogProveProject 
      isOpenDialog={isDialogProve}
      setIsOpenDialog={setIsDialogProve}
      setIsProfile={setIsProfile}
      isSendToDialog={isSendToDialog}
      setIsSendToDialog={setIsSendToDialog}
    />
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
          md={12}
        >
          <Button
            variant="solid"
            color="primary"
            startDecorator={<AccountBalanceWalletIcon />}
            onClick={() => setIsModalRequest(true)}
          >
            List Withdraw
          </Button>

          <Button
            variant="solid"
            color="primary"
            startDecorator={<StorageIcon />}
            sx={{
              marginLeft: 2
            }}
            onClick={() => setIsModalSaldo(true)}
          >
            All Saldo Staff
          </Button>

          {/* MODAL ALL SALDO STAFF */}
          <Modal
            open={isModalSaldo}
            onClose={(event, reason) => {
              if (reason && reason === 'backdropClick') {
                return;
              }
              setIsModalSaldo(false);
            }}
            sx={{
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: 1000,
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
                  md={12}
                >
                  <ModalClose
                    variant="plain"
                    sx={{ m: 1 }}
                  />
                </Grid>

                <Grid
                  md={6}
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'start'
                  }}
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
                    List Saldo Staff
                  </Typography>
                </Grid>

                <Grid
                  md={6}
                  xs={12}
                  margin='15px 0'
                  display='flex'
                  justifyContent='end'
                >
                  <span className="p-input-icon-left">
                    <SearchIcon 
                      style={{ marginTop: '-11px' }}
                    />
                    <InputText 
                      type="search"
                      value={valueSaldo || ""}
                      placeholder="Search here..."
                      size='small'
                      style={{ fontSize: '14px' }}
                      onChange={(e) => onGlobalFilterSaldoChange(e)}
                    />
                  </span>
                </Grid>

                <Grid
                  md={12}
                >
                  <DataTable
                    value={isAllSaldo}
                    size="small"
                    scrollable
                    scrollHeight="400px"
                    rows={10}
                    paginator
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    removableSort
                    tableStyle={{
                      minWidth: '50rem',
                    }}
                    filters={isFilterSaldo}
                    onFilter={(e) => setIsFilterSaldo(e.filters)}
                    emptyMessage="No result found staff"
                  >
                    <Column 
                      header="No"
                      footer="No"
                      body={rowNumberSaldo}
                      style={{ width: '5%' }}
                      frozen
                    />

                    <Column 
                      field="displayUsername"
                      header="Staff"
                      footer="Staff"
                      sortable
                      style={{
                        width: '20%',
                        fontWeight: 'bold'
                      }}
                    />

                    <Column 
                      field="divisi"
                      header="Divisi"
                      footer="Divisi"
                      body={rowDivisiTemplate}
                      sortable
                      filter
                      filterElement={divisiFilterTemplate}
                      style={{
                        width: '20%',
                      }}
                    />

                    <Column 
                      field="saldo"
                      header="Saldo"
                      footer="Saldo"
                      sortable
                      body={rowSaldoStaffTemplate}
                      style={{
                        width: '20%'
                      }}
                    />

                    <Column 
                      field="saldo"
                      header="Last Withdraw"
                      footer="Last Withdraw"
                      body={rowLastWithdrawTemplate}
                    />

                    <Column 
                      header="Action"
                      footer="Action"
                      body={rowButtonSaldoStaff}
                    />

                  </DataTable>
                </Grid>
              </Grid>
            </Sheet>
          </Modal>

          {/* MODAL LIST WITHDRAW */}
          <Modal
            open={isModalRequest}
            onClose={(event, reason) => {
              if (reason && reason === 'backdropClick') {
                return;
              }
              setIsModalRequest(false);
            }}
            sx={{
              zIndex: 1,
              display:'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: 1000,
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
                  md={12}
                >
                  <ModalClose 
                    variant="plain"
                    sx={{ m: 1 }}
                  />
                </Grid>

                <Grid
                  md={6}
                  xs={12}
                  display='flex'
                  justifyContent='start'
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
                    List Withdraw
                  </Typography>
                </Grid>

                <Grid
                  md={6}
                  xs={12}
                  margin='15px 0'
                  display='flex'
                  justifyContent='end'
                >
                  <RefreshListWithdraw 
                    setIsRequestData={setIsRequestData}
                  />
                  <span className="p-input-icon-left">
                    <SearchIcon style={{ marginTop: '-11px' }} />
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

                <Grid
                  md={12}
                >
                  <DataTable
                    value={isRequestData}
                    size="small"
                    scrollable
                    scrollHeight="500px"
                    rows={10}
                    paginator
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    removableSort
                    tableStyle={{ 
                      minWidth: '50rem' 
                    }}
                    filters={isFilter}
                    onFilter={(e) => setIsFilter(e.filters)}
                    emptyMessage="No result found withdraw"
                  >
                    <Column 
                      header="No"
                      footer="No"
                      body={rowNumberTemplate}
                      style={{ width: '5%' }}
                      frozen
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
                      field="amount"
                      header="Total Withdraw"
                      footer="Total Withdraw"
                      sortable
                      body={rowSaldoTemplate}
                      style={{
                        width: '20%',
                      }}
                    />

                    <Column 
                      field="via"
                      header="Via"
                      footer="Via"
                      body={rowViaTemplate}
                      style={{
                        width: '20%',
                      }}
                      filter
                      filterElement={viaRowFilterTemplate}
                    />

                    <Column 
                      field="nomor"
                      header="Nomor HP"
                      footer="Nomor HP"
                      style={{
                        width: '20%'
                      }}
                    />

                    <Column 
                      field="dateWithdraw"
                      header="Date Withdraw"
                      footer="Data Wihtdraw"
                      body={rowDateWithdraw}
                    />

                    <Column 
                      header="Action"
                      footer="Action"
                      body={rowButtonAction}
                    />
                  </DataTable>
                </Grid>
              </Grid>
            </Sheet>
          </Modal>
        </Grid>

        {/* DATATABLE UNTUK DOUJIN */}
        <Grid
          md={12}
        >
          <DatatablesDoujinOwner
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>

        {/* DATATABLE UNTUK MANHWA */}
        <Grid
          md={12}
        >
          <DatatablesManhwaOwner 
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>
      </Grid>
    </Box>
    </>
  )
}

export default ComponentOwner;