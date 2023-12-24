import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconDoujindesu from '../../icon/favicon.svg';
import { Link } from 'react-router-dom';
import { settingsLogout } from '../../utils/dataMenu';
import { useEffect } from 'react';
import { Person, Logout } from '@mui/icons-material/';

function NavbarComponent({ isAuth, isUsername }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    // console.log(isAuth);
  }, [isAuth])

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#e97991' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* ini adalah logo doujindesu */}
          <img src={IconDoujindesu} style={{ width: '50px', height: '50px', marginRight: '10px' }}/>
          
          {/* ini adalah text besar untuk ratio laptop/pc */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Project Collection
          </Typography>

          {/* dan ini adalah untuk text kecil ratio hp/tablet */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '15px'
            }}
          >
            Project Collection
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp">
                  <img src={`https://ui-avatars.com/api/?background=ffffff&color=e97991&size=50&name=${(isUsername === 0) ? 'Loading' : isUsername}`} />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settingsLogout().map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Link
                      to={setting.path}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit'
                      }}  
                    >
                      <Typography
                        textAlign='center'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px', // Adjust the gap as needed
                        }}
                      >{(setting.icon === 'Person') ? <Person /> : <Logout />} {setting.name}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavbarComponent;
