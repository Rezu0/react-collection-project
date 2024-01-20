import { Dialog } from "primereact/dialog";
import React from "react";

function DialogDeleteDoujin({
  isOpenDelete,
  setIsOpenDelete,
  isDataDelete,
  setIsProfie
}) {
  return (
    <>
      <Dialog
        header="Yakin ingin hapus?"
        visible={isOpenDelete}
        onHide={() => {
          setIsOpenDelete(false)
        }}
        style={{
          width: '50vw'
        }}
      >
        {isDataDelete?.title}
      </Dialog>
    </>
  )
}

export default DialogDeleteDoujin;