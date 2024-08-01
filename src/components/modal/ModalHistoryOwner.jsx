import { Grid, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";

function ModalHistoryOwner({
  setIsModalHistoryWithdraw,
  isModalHistoryWithdraw
}) {
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
        alignItems: 'center'
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 1000,
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
                  emptyMessage="Tidak ada data withdraw"
                >

                </DataTable>
              </Grid>
          </Grid>
        </Grid>
      </Sheet>
    </Modal>
  );
}

export default ModalHistoryOwner;
