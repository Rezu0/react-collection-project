import { Button, FormControl, FormLabel, Grid, Input, Option, Select, Textarea } from "@mui/joy";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

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
          >
            Submit Project
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default InputForDoujin;