import { Button, FormControl, FormLabel, Grid, Input, Modal, ModalClose, Option, Select, Sheet, Textarea } from "@mui/joy";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LINK_API } from '../../utils/config.json';
import { toast } from "react-toastify";
import DatatablesDoujin from "./DatatablesDoujin";

const optionsLang = [
  {
    id: 1,
    value: 'eng',
    text: 'English',
  },
  {
    id: 2,
    value: 'jp',
    text: 'Japan',
  },
];

function InputForDoujin({ isProfile, setIsProfile }) {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalDoujin, setIsModalDoujin] = useState(false);
  const [isFormDoujin, setIsFormDoujin] = useState({
    userId: '',
    title: '',
    link: '',
    totalPage: 1,
    lang: null
  });

  useEffect(() => {
    setIsFormDoujin((prevFormData) => ({
      ...prevFormData,
      userId: isProfile.displayId
    }));
  }, [setIsFormDoujin, isProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsFormDoujin((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleSelectLang = (event, newValue) => {
    setIsFormDoujin((prevFormData) => ({
      ...prevFormData,
      lang: newValue
    }));
  }

  const handleSubmit = () => {
    setIsLoadingSubmit(true)
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersSubmit = new Headers();
    headersSubmit.append("Content-Type", "application/json");
    headersSubmit.append("Authorization", `Bearer ${parseStorage._token}`);

    try {
      const rawBody = JSON.stringify(isFormDoujin);
      const optionsSubmit = {
        method: 'POST',
        headers: headersSubmit,
        body: rawBody,
        redirect: 'follow'
      };

      fetch(`${LINK_API}api/doujin`, optionsSubmit)
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setIsProfile(result.data._user)
            setIsFormDoujin(() => ({
              userId: '',
              title: '',
              link: '',
              totalPage: 1,
              lang: null
            }));

            setTimeout(() => {
              toast.success(result.message);
              setIsLoadingSubmit(false);
            }, 2000)
          } else {
            setIsLoadingSubmit(false);
            toast.error(result.message);
          }
          
        }).catch((err) => {
          setIsLoadingSubmit(false);
          toast.error('Terjadi kesalahan saat submit ')
        })
    } catch (err) {
      setIsLoadingSubmit(false);
      toast.error('error di try');
      console.error(err);
    }
  }

  return (
    <>
      <h2 style={{ margin: 0, padding: 0 }}>Form Doujin</h2>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item="true"
          md={12}
          xs={12}
        >
          <FormLabel
            sx={{
              color: '#ffffff'
            }}
          >
            <h3>Title Doujin</h3>
          </FormLabel>
          <FormControl>
            <Input 
              type="text"
              placeholder="Example: Hakari to Karane to IchaLove H suru HON"
              size="md"
              name="title"
              variant="soft"
              value={isFormDoujin.title}
              autoComplete="Title"
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid
          item="true"
          md={12}
          xs={12}
          marginTop={-1}
        >
          <FormLabel
            sx={{
              color: '#ffffff'
            }}
          >
            <h3>Link Project</h3>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Input your link Goodle drive, etc"
              variant="soft"
              autoComplete="Link"
              name="link"
              value={isFormDoujin.link}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid
          item='true'
          md={6}
          xs={6}
        >
          <FormLabel
            sx={{
              color: '#ffffff'
            }}
          >
            <h3>Total Page</h3>
          </FormLabel>
          <FormControl>
            <Input 
              type="number"
              placeholder="Total page..."
              variant="soft"
              name="totalPage"
              autoComplete="Total page"
              value={isFormDoujin.totalPage}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid
          item='true'
          md={6}
          xs={6}
        >
          <FormLabel
            sx={{
              color: '#ffffff'
            }}
          >
            <h3>Language</h3>
          </FormLabel>
          <FormControl>
            <Select
              placeholder="Choose one..."
              name="lang"
              variant="soft"
              value={isFormDoujin.lang}
              onChange={handleSelectLang}
            >
              {optionsLang.map((lang) => (
                <Option
                  key={lang.id}
                  value={lang.value}
                >
                  {lang.text}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item='true'
          md={12}
          xs={12}
        >
          <Button
            variant="solid"
            fullWidth
            color="success"
            onClick={handleSubmit}
            loading={isLoadingSubmit}
          >
            Submit Project
          </Button>
        </Grid>

        <Grid
          item="true"
          md={12}
          xs={12}
        >
          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              setIsModalDoujin(true);
            }}
          >
            Show table
          </Button>
        </Grid>

        {/* MODAL DATATABLE */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isModalDoujin}
          onClose={(event, reason) => {
            if (reason && reason === 'backdropClick') {
              return;
            }
            setIsModalDoujin(false)
          }}
          sx={{
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              width: '100%',
              maxWidth: 1100,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
              height: 'auto'
            }}
          >
            <ModalClose 
              variant="plain"
              sx={{ m: 1 }}
            />

            <DatatablesDoujin 
              isProfile={isProfile}
              setIsProfile={setIsProfile}
            />
          </Sheet>
        </Modal>
      </Grid>
    </>
  )
}

export default InputForDoujin;