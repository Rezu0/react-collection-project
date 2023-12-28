import { FormLabel, Grid, Input, Select, Textarea, Option, IconButton, Typography, Button } from "@mui/joy";
import { FormControl } from "@mui/material";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import { LINK_API } from '../../utils/config.json';

function ModalEditManhwa({ isOpenModal, isDataModal, setIsOpenModal, setIsProfile }) {
  const [isEditData, setIsEditData] = useState();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    setIsEditData((isDataModal))
  }, [isDataModal, setIsEditData])

  const optionsLang = [
    {
      value: 'eng',
      text: 'English',
    },
    {
      value: 'kor',
      text: 'Korea',
    },
    {
      value: 'spa',
      text: 'Spain',
    },
    {
      value: 'chn',
      text: 'China',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsEditData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectLang = (event, newValue) => {
    setIsEditData((prevFormData) => ({
      ...prevFormData,
      lang: newValue
    }));
  };


  const handleSelectIsNew = (event, newValue) => {
    setIsEditData((prevFormData) => ({
      ...prevFormData,
      isNew: newValue
    }));
  }

  const handleClickEdit = () => {
    setIsLoadingButton(true)
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersEdit = new Headers();
    headersEdit.append("Content-Type", "application/json");
    headersEdit.append("Authorization", `Bearer ${parseStorage._token}`);

    try {
      const rawData = JSON.stringify({
        uuid: isEditData?.uuid,
        title: isEditData?.title,
        link: isEditData?.link,
        totalCh: isEditData?.totalCh,
        lang: isEditData?.lang,
        isNew: isEditData?.isNew
      });
      const optionsEdit = {
        method: 'PUT',
        headers: headersEdit,
        body: rawData,
        redirect: 'follow'
      }

      fetch(`${LINK_API}api/manhwa`, optionsEdit)
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setIsProfile(result.data._user)

            setTimeout(() => {
              setIsOpenModal(false)
              setIsEditData(isDataModal)
              setIsLoadingButton(false)
              toast.success(result.message)
            }, 2000)
          }
        }).catch((err) => {
          toast.error('Terjadi kesalahan!');
          setIsLoadingButton(false)
          console.error(err);
        })
    } catch (err) {
      toast.error('Terjadi kesalahan saat edit information!');
    }
  }

  return (
    <>
      <Dialog
        header="Edit your information"
        visible={isOpenModal}
        onHide={() => {
          setIsOpenModal(false)
          setIsEditData(isDataModal);
        }}
        style={{ 
          width: '100vh' 
        }} 
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
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
              value={isEditData?.link}
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
              xs={4}
              md={4}
            >
              <FormLabel>
                <h3>Total Ch</h3>
              </FormLabel>
              
              <FormControl>
                <Input
                  type="number"
                  name="totalCh"
                  placeholder="Total Chapter..."
                  variant="soft"
                  value={isEditData?.totalCh}
                  autoComplete="Total Chapter"
                  onChange={handleInputChange}
                  sx={{
                    width: '90%'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              xs={4}
              md={4}
              // margin="0 2px"
            >
              <FormLabel>
                <h3>Language</h3>
              </FormLabel>

              <FormControl>
                <Select
                  placeholder="Choose one..."
                  name="lang"
                  variant="soft"
                  value={isEditData?.lang}
                  onChange={handleSelectLang}
                  sx={{
                    width: '25vh'
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
              xs={4}
              md={4}
            >
              <FormLabel>
                <h3>Is New?</h3>
              </FormLabel>

              <FormControl>
                <Select
                  placeholder="Choose one..."
                  name="isNew"
                  variant="soft"
                  value={isEditData?.isNew}
                  onChange={handleSelectIsNew}
                  sx={{
                    width: '25vh'
                  }}
                >
                  <Option value={1}>Yes</Option>
                  <Option value="0">No</Option>
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
                  onClick={handleClickEdit}
                  loading={isLoadingButton}
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

export default ModalEditManhwa;