import { Card, CardContent, CardOverflow, Divider, Grid, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handlerFetchingHistory } from "../../utils/handler-fetching";
import { formatToCurrency, formatViaWithdraw, showFormatDateReadable } from '../../utils/dataMenu';
import { Tag } from "primereact/tag";

function ModalHistoryWithdraw({
  isOpenHistory,
  setIsOpenHistory,
  setIsDataHistory,
  isDataHistory
}) {

  const [isDataHistoryComponent, setIsDataHistoryComponent] = useState(null);

  useEffect(() => {
    setIsDataHistoryComponent(isDataHistory);
  }, [setIsDataHistoryComponent, isDataHistory]);

  return (
    <>
      <Modal
        open={isOpenHistory}
        onClose={(event, reason) => {
          if (reason && reason === 'backdropClick') {
            return
          }

          setIsOpenHistory(false);
          setIsDataHistoryComponent(null);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        
      >
        <Sheet
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 1000,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            maxHeight: '80vh', // Limit the height of the sheet
            overflow: 'auto', // Enable scrolling
          }}
        >
          <ModalClose variant="plain" sx={{ m:1}} />
          <Typography
            component="h2"
            id="modal-title"
            level="h3"
            textColor="inherit"
            fontWeight="lg"
            fontFamily='Titillium Web'
            mb={1}
          >
            Riwayat Withdraw
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{ flexGrow: 1, marginTop: '25px' }}
          >
            {(!isDataHistoryComponent) ? 'Loading...' : 
                <>
                  {(isDataHistoryComponent.length === 0) ? 'Data Withdraw kosong!' : ''}
                  {isDataHistoryComponent.map((item) => (
                    <Grid 
                      xs={12} 
                      md={4} 
                      key={item.uuid}
                    >
                      <Card
                        orientation="horizontal"
                        variant="outlined"
                        sx={{ width: 260, }}
                      >
                        <CardContent>
                        <Typography 
                          fontWeight="md" 
                          fontSize="15px" 
                          textColor="success.plainColor"
                        >
                          Jumlah Withdraw: {formatToCurrency(item.amount)}
                        </Typography>
                        <Typography 
                          level="body-sm"
                          fontWeight="lg"
                          fontSize="15px" 
                        >
                          {item.nomor}
                        </Typography>
                        <Tag
                          value={formatViaWithdraw(item.via).via}
                          style={{
                            backgroundColor: `${formatViaWithdraw(item.via).colorBtn}`,
                            width: (item.via === 'Shopee Pay') ? '50%' : '30%'
                          }}
                        />
                        <Divider orientation="horizontal"/>
                        <Typography 
                          level="body-sm"
                          fontWeight="lg"
                          fontSize="13px"
                        >
                          {showFormatDateReadable(item.dateWithdraw)}
                        </Typography>
                        </CardContent>
                        <CardOverflow
                          variant="solid"
                          sx={{
                            px: 0.2,
                            writingMode: 'vertical-rl',
                            justifyContent: 'center',
                            fontSize: 'xs',
                            fontWeight: 'xl',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: (item.status === 'success') ? '#01bf73' : '#d9aa00'
                          }}
                        >
                          {item.status}
                        </CardOverflow>
                      </Card>
                    </Grid>
                  ))}
                </>
              }
          </Grid>
        </Sheet>
      </Modal>
    </>
  )
}

export default ModalHistoryWithdraw;