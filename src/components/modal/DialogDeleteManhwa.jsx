import React from "react";
import { Button } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { LINK_API } from '../../utils/config.json';

function FooterDialogDelete({ 
  setIsOpenDelete,
  isObject,
  setIsProfile
 }) {
  const [isLoadingDelete, setIsDeleteLoading] = useState(false);

  const handlerButtonDelete = () => {
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
            uuid: isObject?.uuid,
            userId: isObject?.userId
          })

          const requestOptions = {
            method: 'DELETE',
            headers: headersDelete,
            body: dataDelete,
            redirect: 'follow'
          }

          fetch(`${LINK_API}api/manhwa`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              setIsProfile(result.data._user)

              setTimeout(() => {
                setIsOpenDelete(false)
                setIsDeleteLoading(false)
                toast.success(result.message)
              }, 2000)
            }).catch((error) => {
              toast.error('Terjadi kesalahan!');
              setIsDeleteLoading(false);
              console.error(error);
            })
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
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
        onClick={handlerButtonDelete}
        loading={isLoadingDelete}
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

function DialogDeleteManhwa({ 
  isOpenDelete,
  setIsOpenDelete,
  isData,
  setIsProfile
}) {
  const [isObject, setIsObject] = useState(null);

  useEffect(() => {
    setIsObject(isData);
  }, [setIsObject, isData])

  return (
    <>

      <Dialog
        header="Yakin ingin hapus?"
        visible={isOpenDelete}
        style={{
          width: '50vw'
        }}
        onHide={() => {
          setIsOpenDelete(false)
          setIsObject(isData)
        }}
        footer={
          <FooterDialogDelete 
            setIsOpenDelete={setIsOpenDelete}
            isObject={isObject}
            setIsProfile={setIsProfile}
          />
        }
      >
      {isData?.title}
      </Dialog>
    </>
  )
}

export default DialogDeleteManhwa;