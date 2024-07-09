import { Dialog } from "primereact/dialog";

function DialogProveProject({
  isOpenDialog,
  setIsOpenDialog,
  setIsProfile,
  isSendToDialog,
  setIsSendToDialog
}) {
  return (
    <>
      <Dialog
        header="Nama Staff dan divisi"
        visible={isOpenDialog}
        onHide={() => {
          setIsOpenDialog(false)
        }}
        style={{
          width: '50vw'
        }}
      >
        Testing ngab
      </Dialog>  
    </>
  )
}

export default DialogProveProject;