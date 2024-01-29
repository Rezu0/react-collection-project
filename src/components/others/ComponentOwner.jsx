import { Grid, Typography } from "@mui/joy";
import React from "react";
import DatatablesDoujinOwner from "../datatables/DatatablesDoujinOwner";
import DatatablesManhwaOwner from "../datatables/DatatablesManhwaOwner";

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
          <DatatablesDoujinOwner
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>

        <Grid
          md={12}
        >
          <DatatablesManhwaOwner 
            isProfile={isProfile}
            setIsProfile={setIsProfile}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default ComponentOwner;