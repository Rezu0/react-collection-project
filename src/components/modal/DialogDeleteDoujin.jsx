import { Button } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import { useState } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";

function FooterDialogDelete({
  setIsOpenDelete,
  setIsProfie,
  isDataDelete
}) {
  const [isLoadingDelete, setIsDeleteLoading] = useState(false);

  const handleOnClickDelete = () => {
    setIsDeleteLoading(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    try {
      if (storedToken) {
        if (parseStorage.state) {
          const headersDelete = new Headers();
          headersDelete.append("Content-Type", "application/json");
          headersDelete.append("Authorization", `Bearer ${parseStorage._token}`);

          const dataDelete = JSON.stringify({
            uuid: isDataDelete?.uuid,
            userId: isDataDelete?.userId
          });

          const requestOptions = {
            method: 'DELETE',
            headers: headersDelete,
            body: dataDelete,
            redirect: 'follow'
          }

          fetch(`${LINK_API}api/doujin`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.data) {
                setIsProfie(result.data._user)

                setTimeout(() => {
                  setIsOpenDelete(false);
                  setIsDeleteLoading(false);
                  toast.success(result.message);
                }, 2000);
              }

            }).catch((err) => {
              toast.error('Terjadi kesalahan!');
              console.error('Error onClick delete: ', err);
            })
        }
      }
    } catch (err) {
      toast.error('Terjadi kesalahan!');
      console.error('Error catch: ', err);
    }
  }

  return (
    <>
      <Button
        variant="solid"
        color="danger"
        component="a"
        startDecorator={<CheckIcon />}
        sx={{
          margin: '0px 10px'
        }}
        loading={isLoadingDelete}
        onClick={handleOnClickDelete}
      >
        Yes!
      </Button>

      <Button
        variant="solid"
        color="neutral"
        component="a"
        startDecorator={<CloseIcon />}
        onClick={() => {
          setIsOpenDelete(false)
        }}
      >
        No!
      </Button>
    </>
  )
}

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
        footer={
          <FooterDialogDelete 
            setIsOpenDelete={setIsOpenDelete}
            setIsProfie={setIsProfie}
            isDataDelete={isDataDelete}
          />
        }
      >
        {isDataDelete?.title}
      </Dialog>
    </>
  )
}

export default DialogDeleteDoujin;