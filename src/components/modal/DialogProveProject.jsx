import { Typography } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import { useEffect } from "react";
import { useState } from "react";

function DialogProveProject({
  isOpenDialog,
  setIsOpenDialog,
  setIsProfile,
  isSendToDialog,
  setIsSendToDialog,
  setIsDataProve,
  isDataProve
}) {
  const [isDataDialog, setIsDataDialog] = useState()
  const [isProject, setIsProject] = useState(null);

  useEffect(() => {
    setIsDataDialog({
      namaStaff: isSendToDialog?.displayUsername,
      divisiStaff: isSendToDialog?.divisi,
    })
  }, [setIsDataDialog, isSendToDialog?.displayUsername, isSendToDialog?.divisi])

  useEffect(() => {
    setIsProject(isDataProve);
  }, [setIsProject, isDataProve])


  return (
    <>
      <Dialog
        header={`${isDataDialog?.namaStaff} - ${isDataDialog?.divisiStaff}`}
        visible={isOpenDialog}
        onHide={() => {
          setIsOpenDialog(false)
          setIsDataProve(null)
        }}
        style={{
          width: '50vw'
        }}
      >
        {(!isProject?.projectsDoujin) ? 
          <>
            {/* INI ADALAH RENDER UNTUK STAFF MANHWA */}
            {(!isProject?.projects.length) ?
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
                
                {isProject?.users?.saldo[0].lastWithdraw }
              </> :
              isProject?.projects?.map((item) => (
                <div key={item.uuid}>
                  {item.title}
                </div>
              ))
            }
          </> : 
          <>
            {/* INI ADALAH RENDER UNTUK STAFF DOUJIN */}
            {(!isProject?.projectsDoujin.length) ?
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
                
                {isProject?.users?.saldo[0].lastWithdraw }
              </> :
              isProject?.projectsDoujin?.map((item) => (
                <div key={item.uuid}>
                  {item.title}
                </div>
              ))
            }
          </>  
        }
      </Dialog>  
    </>
  )
}

export default DialogProveProject;