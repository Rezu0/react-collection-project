import { FormLabel, Input, Textarea } from "@mui/joy";
import { FormControl } from "@mui/material";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function ModalEditManhwa({ isOpenModal, isDataModal, setIsOpenModal }) {
  const [isEditData, setIsEditData] = useState();

  useEffect(() => {
    setIsEditData(isDataModal)
  }, [isDataModal, setIsEditData])

  return (
    <>
      <Dialog
        header="Edit your information"
        visible={isOpenModal}
        onHide={() => {
          setIsOpenModal(false)
        }}
        style={{ width: '50vh' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <form>
          <FormLabel>
            <h2>Title</h2>
          </FormLabel>
          <FormControl 
            sx={{
              width: '100%'
            }}
          >
            <Input 
              type="text"
              size="md"
              name="title"
              variant="outlined"
              autoComplete="Title"
              value={isEditData?.title}
            />
          </FormControl>

          <FormLabel>
            <h2>Link</h2>
          </FormLabel>
          <FormControl
            sx={{
              width: '100%'
            }}
          >
            <Textarea 
              name="link"
              variant="outlined"
              value={isEditData?.link}
              autoComplete="Link"
            />
          </FormControl>
        </form>
      </Dialog>
    </>
  )
}

export default ModalEditManhwa;