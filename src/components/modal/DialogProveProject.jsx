import { Grid, Typography } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import {
  calculateDoujin,
  calculateManhwa,
  languageProject,
  showFormatDateReadable,
  formatToCurrency
} from '../../utils/dataMenu';

function DialogProveProject({
  isOpenDialog,
  setIsOpenDialog,
  setIsProfile,
  isSendToDialog,
  setIsSendToDialog,
  setIsDataProve,
  isDataProve
}) {
  const [isDataDialog, setIsDataDialog] = useState();
  const [isProject, setIsProject] = useState(null);
  const [isStateSaldo, setIsStateSaldo] = useState();

  useEffect(() => {
    setIsDataDialog({
      namaStaff: isSendToDialog?.displayUsername,
      divisiStaff: isSendToDialog?.divisi,
    });
  }, [setIsDataDialog, isSendToDialog?.displayUsername, isSendToDialog?.divisi]);

  useEffect(() => {
    setIsProject(isDataProve);
  }, [setIsProject, isDataProve]);

  useEffect(() => {
    if (isProject?.projectsDoujin) {
      if (!isProject?.projectsDoujin.length) {
        return;
      }

      const totalSaldo = isProject?.projectsDoujin.reduce((acc, item) => {
        return acc + calculateDoujin(item.lang, item.totalPage);
      }, 0)
      setIsStateSaldo(totalSaldo);
    }

    if (isProject?.projects) {
      if (!isProject?.projects.length) {
        return;
      }
      const totalSaldo = isProject?.projects.reduce((acc, item) => {
        return acc + calculateManhwa(item.lang, item.totalCh, item.isNew)
      }, 0)
      setIsStateSaldo(totalSaldo)
    }
  }, [isProject?.projects, isProject?.projectsDoujin, setIsStateSaldo])

  return (
    <>
      <Dialog
        header={`${isDataDialog?.namaStaff} - ${isDataDialog?.divisiStaff}`}
        visible={isOpenDialog}
        onHide={() => {
          setIsOpenDialog(false);
          setIsDataProve(null);
        }}
        style={{
          width: '70vw'
        }}
      >
        {(!isProject?.users) ? (
          <>
            <Typography
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 900,
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '20px',
                marginTop: '10px',
                marginBottom: '20px'
              }}
            >
              Data Dari ( {showFormatDateReadable(isProject?.user?.saldo[0].lastWithdraw)} ) - ( {showFormatDateReadable(new Date().toISOString())} )
            </Typography>
          </>
        ) : (
          ''
        )}
        
        {(!isProject?.projectsDoujin) ? (
          <>
            {/* INI ADALAH RENDER UNTUK STAFF MANHWA */}
            {(!isProject?.projects.length) ? (
              <>
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
                    fontSize: '15px'
                  }}
                >
                  Tidak ada data / Staff sudah Withdraw
                </Typography>

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
                    fontSize: '20px',
                    marginTop: '10px'
                  }}
                >
                  Last Withdraw: {showFormatDateReadable(isProject?.users?.saldo[0].lastWithdraw)}
                </Typography>
              </>
            ) : (
              <>
                {
                  isProject?.projects?.map((item) => (
                    <Grid
                    container
                    spacing={2}
                    sx={{ flexGrow: 1, border: '1px solid #000000', borderRadius: '7px' }}
                    columns={16}
                    my={1}
                    key={item.uuid}
                  >
                    <Grid
                      md={5}
                      fontWeight={500}
                      borderRight='1px solid #000000'
                    >
                      {item.title}
                    </Grid>
                    <Grid
                      md={2}
                      fontWeight={600}
                      textAlign='center'
                      borderRight='1px solid #000000'
                    >
                      {languageProject(item.lang)}
                    </Grid>
                    <Grid
                      md={4}
                      fontWeight={500}
                      textAlign='center'
                      borderRight='1px solid #000000'
                    >
                      {item.totalCh} Chapter ( {(item.isNew === 1) ? 'New' : 'Not New'} ) = {calculateManhwa(item.lang, item.totalCh, item.isNew)}
                    </Grid>
                    <Grid
                      md={5}
                      textAlign='center'
                    >
                      {showFormatDateReadable(item.insertedAt)}
                    </Grid>
                  </Grid>
                  ))
                }
                
                {/* GRID UNTUK TOTAL MANHWA */}
                <Grid
                  container
                  spacing={2}
                  sx={{ flexGrow: 1 }}
                  columns={16}
                  mt={5}
                >
                  <Grid
                    md={5}
                    fontWeight={900}
                    fontSize='20px'
                  >
                    Total
                  </Grid>
                  <Grid
                    md={8}
                    fontWeight={900}
                    fontSize='20px'
                    textAlign='center'
                  >
                    {formatToCurrency(isStateSaldo)}
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ) : (
          <>
            {/* INI ADALAH RENDER UNTUK STAFF DOUJIN */}
            {(!isProject?.projectsDoujin.length) ? (
              <>
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
                    fontSize: '15px'
                  }}
                >
                  Tidak ada data / Staff sudah Withdraw
                </Typography>

                {showFormatDateReadable(isProject?.users?.saldo[0].lastWithdraw)}
              </>
            ) : (
              <>
                {isProject?.projectsDoujin?.map((item) => (
                  <Grid
                    container
                    spacing={2}
                    sx={{ flexGrow: 1, border: '1px solid #000000', borderRadius: '7px' }}
                    columns={16}
                    my={1}
                    key={item.uuid}
                  >
                    <Grid
                      md={5}
                      fontWeight={500}
                      borderRight='1px solid #000000'
                    >
                      {item.title}
                    </Grid>
                    <Grid
                      md={2}
                      fontWeight={600}
                      textAlign='center'
                      borderRight='1px solid #000000'
                    >
                      {languageProject(item.lang)}
                    </Grid>
                    <Grid
                      md={4}
                      fontWeight={500}
                      textAlign='center'
                      borderRight='1px solid #000000'
                    >
                      {item.totalPage} Page = {calculateDoujin(item.lang, item.totalPage)}
                    </Grid>
                    <Grid
                      md={5}
                      textAlign='center'
                    >
                      {showFormatDateReadable(item.insertedAt)}
                    </Grid>
                  </Grid>
                ))}

                {/* GRID UNTUK TOTAL DOUJIN */}
                <Grid
                  container
                  spacing={2}
                  sx={{ flexGrow: 1 }}
                  columns={16}
                  mt={5}
                >
                  <Grid
                    md={5}
                    fontWeight={900}
                    fontSize='20px'
                  >
                    Total
                  </Grid>
                  <Grid
                    md={8}
                    fontWeight={900}
                    fontSize='20px'
                    textAlign='center'
                  >
                    {formatToCurrency(isStateSaldo)}
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}

export default DialogProveProject;
