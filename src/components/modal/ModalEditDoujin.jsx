import { Button, FormControl, FormLabel, Grid, Input, Option, Select, Textarea } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';

function ModalEditDoujin({ 
  isOpenModalEdit,
  setIsOpenModalEdit,
  isDataEdit,
  setIsDataEdit
}) {
  const [isFormData, setIsFormData] = useState(null);

  useEffect(() => {
    setIsFormData(isDataEdit);
  }, [setIsFormData, isDataEdit])

  const optionsLang = [
    {
      value: 'eng',
      text: 'English'
    },
    {
      value: 'jp',
      text: 'Japan'
    }
  ];

  console.log(isFormData?.title);
  return (
    <>
      <Dialog
        header="Edit your information"
        visible={isOpenModalEdit}
        style={{
          width: '50vw'
        }}
        onHide={() => {
          setIsOpenModalEdit(false)
          setIsFormData(isDataEdit);
        }}
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
            value={isFormData?.title}
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
            value={isFormData?.link}
            autoComplete="Link"
          />
        </FormControl>

        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1
          }}
        >
          <Grid
            xs={6}
            md={6}
          >
            <FormLabel>
              <h3>Total Ch</h3>
            </FormLabel>
            <FormControl>
              <Input 
                type="number"
                name="totalPage"
                placeholder="Total Page..."
                variant="soft"
                value={isFormData?.totalPage}
                autoComplete="Total Page"
                sx={{
                  width: '100%'
                }}
              />
            </FormControl>
          </Grid>

          <Grid
            xs={6}
            md={6}
          >
            <FormLabel>
              <h3>Language</h3>
            </FormLabel>
            <FormControl>
              <Select
                placeholder="Choose one..."
                name="lang"
                variant="soft"
                value={isFormData?.lang}
                sx={{
                  width: '100%'
                }}
              >
                {optionsLang.map((lang) => (
                  <Option
                    key={lang.value}
                    value={lang.value}
                  >
                    {lang.text}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            xs={12}
            md={12}
          >
            <Button
              variant="solid"
              startDecorator={<EditIcon />}
              color="success"
            >
              Update information
            </Button>
          </Grid>
        </Grid>
        </form>
      </Dialog>
    </>
  )
}

export default ModalEditDoujin;