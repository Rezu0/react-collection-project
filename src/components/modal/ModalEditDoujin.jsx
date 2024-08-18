import { Button, FormControl, FormLabel, Grid, Input, Modal, ModalClose, Option, Select, Sheet, Textarea } from "@mui/joy";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";

function ModalEditDoujin({ 
  isOpenModalEdit,
  setIsOpenModalEdit,
  isDataEdit,
  setIsProfile
}) {
  const [isFormData, setIsFormData] = useState(null);
  const [isLoadingEditBtn, setIsLoadingEditBtn] = useState(false);

  useEffect(() => {
    setIsFormData(isDataEdit);
  }, [setIsFormData, isDataEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSelectLang = (event, newValue) => {
    setIsFormData((prevFormData) => ({
      ...prevFormData,
      lang: newValue,
    }));
  };

  const onClickButtonEdit = () => {
    setIsLoadingEditBtn(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersEdit = new Headers();
    headersEdit.append("Content-Type", "application/json");
    headersEdit.append("Authorization", `Bearer ${parseStorage._token}`);

    try {
      const rawData = JSON.stringify({
        uuid: isFormData?.uuid,
        title: isFormData?.title,
        totalPage: isFormData?.totalPage,
        lang: isFormData?.lang,
        link: isFormData?.link
      });

      const requestOptions = {
        method: 'PUT',
        headers: headersEdit,
        body: rawData,
        redirect: 'follow'
      };

      fetch(`${LINK_API}api/doujin`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setIsProfile(result.data._user);

            setTimeout(() => {
              setIsOpenModalEdit(false)
              setIsFormData(isDataEdit)
              setIsLoadingEditBtn(false);
              toast.success(result.message)
            }, 2000)
          }
        }).catch((err) => {
          setIsLoadingEditBtn(false);
          toast.error('Edit doujin gagal!');
          console.error(err);
        })
    } catch (err) {
      setIsLoadingEditBtn(false);
      console.error(err);
    }
  };

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

  return (
    <>
      <Modal
        open={isOpenModalEdit}
        onClose={(event, reason) => {
          if (reason && reason === 'backdropClick') return;
          setIsOpenModalEdit(false)
          setIsFormData(isDataEdit);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 700,
            borderRadius: 'md',
            boxShadow: 'lg',
            height: 'auto'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  <h3>Total Page</h3>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    name="totalPage"
                    placeholder="Total Page..."
                    variant="soft"
                    value={isFormData?.totalPage}
                    autoComplete="Total Page"
                    onChange={handleInputChange}
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
                    onChange={handleSelectLang}
                    sx={{
                      width: '100%',
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
                  loading={isLoadingEditBtn}
                  onClick={onClickButtonEdit}
                >
                  Update information
                </Button>
              </Grid>
            </Grid>
          </form>
        </Sheet>
      </Modal>
    </>
  )
}

export default ModalEditDoujin;