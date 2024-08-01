import { Grid, Modal, ModalClose, Sheet, Tooltip, Typography } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { useEffect } from "react";
import { Column } from "primereact/column";
import { formatDateForHuman, formatDivisiStaff, formatToCurrency, formatViaWithdraw, showFormatDateReadable } from "../../utils/dataMenu";
import { Tag } from "primereact/tag";

function ModalHistoryOwner({
  setIsModalHistoryWithdraw,
  isModalHistoryWithdraw,
  setIsDataHistoryOwner,
  isDataHistoryOwner
}) {

  const [isDataHistoryComponent, setIsDataHistoryComponent] = useState();

  useEffect(() => {
    setIsDataHistoryComponent(isDataHistoryOwner);
  }, [setIsDataHistoryComponent, isDataHistoryOwner]);

  const rowNumberSaldo = (row, column) => {
    const rowIndex = isDataHistoryComponent.indexOf(row) + 1;
    return rowIndex;
  }

  const rowDivisiTemplate = (data) => {
    const formatedDivisi = formatDivisiStaff(data?.user?.divisi);
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

  const rowAmountSaldoStaffTemplate = (data) => {
    return `${formatToCurrency(data?.amount)}`;
  }

  const rowStatusWithdrawTemplate = (data) => {
    return (
      <>
        <Tag 
          value={(data?.status === 'success') ? 'Success' : 'Pending'}
          style={{
            backgroundColor: '#22c55e'
          }}
        />
      </>
    )
  }

  const rowDateWithdrawTemplate = (data) => {
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

  console.log(isDataHistoryComponent);

  return (
    <Modal
      open={isModalHistoryWithdraw}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') {
          return;
        }

        setIsModalHistoryWithdraw(false)
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 1100,
          borderRadius: 'md',
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
                  Riwayat withdraw
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
                  <SearchIcon sx={{ marginTop: '-11px' }} />
                  <InputText 
                    type="search"
                    value=""
                    placeholder="Search here..."
                    size="small"
                    style={{ fontSize: '14px' }}
                  />
                </span>
              </Grid>

              <Grid
                md={12}
              >
                <DataTable
                  value={isDataHistoryComponent}
                  size="small"
                  scrollable
                  scrollHeight="400px"
                  rows={10}
                  paginator
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  removableSort
                  tableStyle={{
                    minWidth: '50rem'
                  }}
                  emptyMessage="Tidak ada data withdraw"
                >
                  <Column 
                    header="No"
                    footer="No"
                    body={rowNumberSaldo}
                    style={{ width: '5%' }}
                    frozen
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
                    field="user"
                    header="Divisi"
                    footer="Divisi"
                    body={rowDivisiTemplate}
                    filter
                    style={{
                      width: '20%',
                    }}
                  />

                  <Column 
                    header="Amount"
                    footer="Amount"
                    body={rowAmountSaldoStaffTemplate}
                    sortable
                    style={{
                      width: '20%'
                    }}
                  />

                  <Column 
                    header="Via"
                    footer="Via"
                    body={rowViaTemplate}
                    style={{
                      width: '20%'
                    }}
                  />

                  <Column 
                    header="Status"
                    footer="Status"
                    body={rowStatusWithdrawTemplate}
                    sortable
                    style={{
                      width: '20%'
                    }}
                  />

                  <Column 
                    header="Date Withdraw"
                    footer="Date Withdraw"
                    body={rowDateWithdrawTemplate}
                    sortable
                  />
                </DataTable>
              </Grid>
          </Grid>
        </Grid>
      </Sheet>
    </Modal>
  );
}

export default ModalHistoryOwner;
