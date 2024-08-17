import { Button, FormControl, FormLabel, Grid, Input, MenuItem, Modal, ModalClose, Option, Select, Sheet, Textarea } from "@mui/joy";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { LINK_API } from '../../utils/config.json';
import DatatablesManhwa from "./DatatablesManhwa";
import InputForDoujin from "./InputForDoujin";
import ComponentOwner from "./ComponentOwner";

function InputProject({ isDivision, isProfile, setIsProfile }) {
  const [isFormData, setIsFormData] = useState({
    userId: '',
    title: "",
    totalCh: 1,
    lang: null,
    isNew: null,
    link: ""
  });
  const [isModal, setIsModal] = useState(false);
  const [isIdForDatatable, setIsForDatatable] = useState(false);
  const [isLoadingManhwa, setIsLoadingManwha] = useState(false);

  useEffect(() => {
    setIsFormData((prevFormData) => ({
      ...prevFormData,
      userId: isProfile.displayId
    }))
    setIsForDatatable(setIsForDatatable(isProfile.displayId));
  }, [isProfile, setIsFormData, isIdForDatatable])

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
      text: 'Spain'
    },
    {
      value: 'chn',
      text: 'China',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setIsFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleSelectLang = (event, newValue) => {
    setIsFormData((prevFormData) => ({
      ...prevFormData,
      lang: newValue
    }))
  };

  const handleSelectIsNew = (event, newValue) => {
    setIsFormData((prevFormData) => ({
      ...prevFormData,
      isNew: newValue,
      // userId: isProfile.displayId
    }))
  }

  const handleSubmit = () => {
    setIsLoadingManwha(true);
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersSubmit = new Headers();
    headersSubmit.append("Content-Type", "application/json");
    headersSubmit.append("Authorization", `Bearer ${parseStorage._token}`);
    
    try {
      const rawBody = JSON.stringify(isFormData);
      const optionsSubmit = {
        method: 'POST',
        headers: headersSubmit,
        body: rawBody,
        redirect: 'follow'
      };

      fetch(`${LINK_API}api/manhwa`, optionsSubmit)
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            setTimeout(() => {
              setIsProfile(result.data._user)
              setIsFormData(() => ({
                userId: '',
                title: "",
                totalCh: 1,
                lang: null,
                isNew: null,
                link: ""
              }));
              setIsLoadingManwha(false);
              toast.success(result.message);
            }, 2000);
          } else {
            setIsLoadingManwha(false);
            toast.error(result.message);
          }
        }).catch((err) => {
          toast.error('Terjadi kesalahan saat submit!');
          setIsLoadingManwha(false);
          console.error(err);
        })
    } catch (err) {
      console.error(err);
      toast.error('Terjadi Kesalahan!');
    }
  }
  
  return (
    <>
    {/* INPUT UNTUK STAFF MANHWA */}
      {(isDivision === 'manhwa') ? 
        <>
          <h2 style={{ margin: 0, padding: 0 }}>Form Manhwa</h2>
          <form>
            <FormLabel
              sx={{
                color: '#ffffff',
              }}
            >
              <h2>Judul Manhwa</h2>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Contoh: Queen Bee Chapter 10"
                size="md"
                name="title"
                variant="soft"
                value={isFormData.title}
                autoComplete="Title"
                onChange={handleInputChange}
              />
            </FormControl>

            <FormLabel
              sx={{
                color: '#ffffff',
              }}
            >
              <h2>Link Project</h2>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Input your link Google drive, etc"
                name="link"
                variant="soft"
                value={isFormData.link}
                autoComplete="Link"
                onChange={handleInputChange}
              />
            </FormControl>

            <Grid
              container
              spacing={2}
            >
              <Grid
                item="true"
                md={4}
                xs={4}
              >
                <FormLabel
                  sx={{
                    color: '#ffffff',
                  }}
                >
                  <h4>Berapa Chapter?</h4>
                </FormLabel>
                <FormControl sx={{ marginTop: -1 }}>
                  <Input 
                    type="number"
                    name="totalCh"
                    placeholder="Total Chapter..."
                    variant="soft"
                    value={isFormData.totalCh}
                    autoComplete="Total Chapter"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid
                item="true"
                md={4}
                xs={4}
              >
                <FormLabel
                  sx={{
                    color: '#ffffff',
                  }}
                >
                  <h4>Bahasa</h4>
                </FormLabel>
                <FormControl sx={{ marginTop: -1 }}>
                  <Select 
                    placeholder="Choose one..."
                    name="lang"
                    variant="soft"
                    value={isFormData.lang}
                    onChange={handleSelectLang}
                  >
                    {optionsLang.map((lang) => (
                      <Option
                        key={lang.value}
                        value={lang.value}
                      >{lang.text}</Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item="true"
                md={4}
                xs={4}
              >
                <FormLabel
                  sx={{
                    color: '#ffffff',
                  }}
                >
                  <h4>New/Tidak</h4>
                </FormLabel>
                <FormControl sx={{ marginTop: -1 }}>
                  <Select
                    placeholder="Choose one..."
                    name="isNew"
                    variant="soft"
                    value={isFormData.isNew}
                    onChange={handleSelectIsNew}
                  >
                    <Option value={1}>Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              fullWidth
              color="success"
              variant="solid"
              onClick={handleSubmit}
              sx={{
                margin: '20px 0 20px 0'
              }}
              loading={isLoadingManhwa}
            >
              KUMPUL PROJECT
            </Button>
          </form>
          

          {/* MODAL TABLE DATA! */}
          <Sheet
            variant="outlined"
            sx={{
              width: '100%',
              maxWidth: 1100,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
              // height: '80vh',
              height: 'auto',
              // overflowY: 'auto'
            }}
          >
            <DatatablesManhwa 
              isProfile={isProfile}
              setIsProfile={setIsProfile}
            />
          </Sheet>
        </>
        : (isDivision === 'doujin') ? 
        <InputForDoujin 
          isProfile={isProfile}
          setIsProfile={setIsProfile}
        /> : <ComponentOwner 
        isProfile={isProfile}
        setIsProfile={setIsProfile} />
      }
    </>
  )
}

export default InputProject;