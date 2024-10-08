import { FormLabel, Grid, Input, Select, Textarea, Option, Button, Modal, Sheet, ModalClose } from "@mui/joy";
import { FormControl } from "@mui/material";
import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import { LINK_API } from '../../utils/config.json';

function ModalEditManhwa({ 
  isOpenModal, 
  isDataModal, 
  setIsOpenModal, 
  setIsProfile
}) {
  const [isEditData, setIsEditData] = useState({
    title: "",
    link: "",
    totalCh: "",
    lang: "",
    isNew: "",
    oktWm: "",
  });
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    setIsEditData(isDataModal || {
      title: "",
      link: "",
      totalCh: "",
      lang: "",
      isNew: "",
      oktWm: "",
    });
  }, [isDataModal]);

  const optionsLang = [
    { value: 'eng', text: 'English' },
    { value: 'kor', text: 'Korea' },
    { value: 'spa', text: 'Spain' },
    { value: 'chn', text: 'China' },
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
      lang: newValue || ""
    }));
  };

  const handleSelectIsNew = (event, newValue) => {
    setIsEditData((prevFormData) => ({
      ...prevFormData,
      isNew: newValue || ""
    }));
  };

  const handlerSeletOktWm = (event, newValue) => {
    setIsEditData((prevFormData) => ({
      ...prevFormData,
      oktWm: newValue || ""
    }));
  };

  const handleClickEdit = () => {
    setIsLoadingButton(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersEdit = new Headers();
    headersEdit.append("Content-Type", "application/json");
    headersEdit.append("Authorization", `Bearer ${parseStorage._token}`);

    const rawData = JSON.stringify({
      uuid: isEditData?.uuid,
      title: isEditData?.title,
      link: isEditData?.link,
      totalCh: isEditData?.totalCh,
      lang: isEditData?.lang,
      isNew: isEditData?.isNew,
      oktWm: isEditData?.oktWm,
    });

    const optionsEdit = {
      method: 'PUT',
      headers: headersEdit,
      body: rawData,
      redirect: 'follow'
    };

    fetch(`${LINK_API}api/manhwa`, optionsEdit)
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setIsProfile(result.data._user);
          setTimeout(() => {
            setIsOpenModal(false);
            setIsEditData(isDataModal);
            setIsLoadingButton(false);
            toast.success(result.message);
          }, 2000);
        }
      })
      .catch((err) => {
        toast.error('Terjadi kesalahan!');
        setIsLoadingButton(false);
        console.error(err);
      });
  };

  return (
    <Modal
      open={isOpenModal}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;
        setIsOpenModal(false);
        setIsEditData(isDataModal);
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
          height: 'auto',
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <form>
          <FormLabel>
            <h2>Title</h2>
          </FormLabel>
          <FormControl sx={{ width: '100%' }}>
            <Input 
              type="text"
              size="md"
              name="title"
              variant="outlined"
              autoComplete="Title"
              value={isEditData?.title || ""}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormLabel>
            <h2>Link</h2>
          </FormLabel>
          <FormControl sx={{ width: '100%' }}>
            <Textarea 
              name="link"
              variant="outlined"
              value={isEditData?.link || ""}
              autoComplete="Link"
              onChange={handleInputChange}
            />
          </FormControl>

          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item="true" xs={6} md={6}>
              <FormLabel>
                <h3>Total Ch</h3>
              </FormLabel>
              <FormControl sx={{ width: '100%' }}>
                <Input
                  type="number"
                  name="totalCh"
                  placeholder="Total Chapter..."
                  variant="soft"
                  value={isEditData?.totalCh || ""}
                  autoComplete="Total Chapter"
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item="true" xs={6} md={6}>
              <FormLabel>
                <h3>Language</h3>
              </FormLabel>
              <FormControl sx={{ width: '100%' }}>
                <Select
                  placeholder="Choose one..."
                  name="lang"
                  variant="soft"
                  value={isEditData?.lang || ""}
                  onChange={handleSelectLang}
                >
                  {optionsLang.map((lang) => (
                    <Option key={lang.value} value={lang.value}>
                      {lang.text}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item="true" xs={6} md={6}>
              <FormLabel>
                <h3>Is New?</h3>
              </FormLabel>
              <FormControl sx={{ width: '100%' }}>
                <Select
                  placeholder="Choose one..."
                  name="isNew"
                  variant="soft"
                  value={isEditData?.isNew || ""}
                  onChange={handleSelectIsNew}
                >
                  <Option value={1}>Yes</Option>
                  <Option value="0">No</Option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item="true" xs={6} md={6}>
              <FormLabel>
                <h3>OKT WM?</h3>
              </FormLabel>
              <FormControl sx={{ width: '100%' }}>
                <Select
                  placeholder="Choose one..."
                  name="oktWm"
                  variant="soft"
                  value={isEditData?.oktWm || ""}
                  onChange={handlerSeletOktWm}
                >
                  <Option value="0">NO WM OKT</Option>
                  <Option value={1}>WM OKT</Option>
                  <Option value={2}>CLEAN WM OKT</Option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item="true" xs={12} md={12}>
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
      </Sheet>
    </Modal>
  );
}

export default ModalEditManhwa;
