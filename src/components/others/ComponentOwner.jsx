import { Grid, Typography } from "@mui/joy";
import React from "react";
import DatatablesDoujinOwner from "../datatables/DatatablesDoujinOwner";

function ComponentOwner({ isProfile, setIsProfile }) {
  return (
    <>
      <Grid
        container
        spacing={2}
      >
        <Grid
          md={12}
        >
          <DatatablesDoujinOwner />
        </Grid>

        <Grid
          md={12}
        >
          <Typography
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '25px'
            }}
          >
            Data Manhwa
          </Typography>

          {/* <DataTable
            size="small"
            scrollable
            scrollHeight="400px"
            removableSort
          >
            <Column 
              header="Nomor"
              footer="Nomor"
            />
            <Column 
              header="Title"
              footer="Title"
              sortable
            />
          </DataTable> */}
        </Grid>
      </Grid>
    </>
  )
}

export default ComponentOwner;