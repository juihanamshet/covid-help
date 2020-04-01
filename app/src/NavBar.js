import React from 'react';
import { Toolbar, AppBar, Typography, MenuList, Divider, MenuItem, Popper, Paper, Grow, ClickAwayListener } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        boxShadow: 'none',
    },
    title: {
        flexGrow: 1,
        "&:hover": {
            color: '#eceff1',
            textDecoration: 'none',
        }
    },
    titleText:{
        color: 'white',
    },
    tab: {
        color: 'white',
        paddingRight: 15,
        fontWeight: 500,
        "&:hover": {
            color: '#eceff1',
            textDecoration: 'underline',
        }
    },
    menuItem: {
        marginBottom: 2.5,
        marginTop: 2.5
    },
    menuLink: {
        color: 'black',
        "&:hover": {
            color: 'black',
            textDecoration: 'none'
        }
    },
}));

const NavBar = () => {
    const classes = useStyles();
    const { authState, authService } = useOktaAuth();
    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
        setOpen(false);
    };
    
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        }
    }
    
      // useEffect works by taking the second argument (open), and only applying the function when that given value changes
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
          anchorRef.current.focus();
    }
    
        prevOpen.current = open;
      }, [open]);

    const loginButton = !authState.isAuthenticated ?
        <Link className={classes.tab} to="/login">Login</Link> :
        <Link
          ref={anchorRef}
          onMouseEnter={handleToggle}
          className={classes.tab}
          to="/user">
            User <ArrowDropDownIcon/>
        </Link>;

    return (
        <AppBar className={classes.appBar} position="sticky" color="primary">
            <Toolbar>
                <Link
                    className={classes.title}
                    to="/">
                    <Typography className={classes.titleText} variant="h5" >
                        <span role="img" aria-label="house with garden">🏡</span> Project Student Relief
                    </Typography>
                </Link>
                <Link
                    className={classes.tab}
                    to="/">
                    About Us
                </Link>
                <Link
                    className={classes.tab}
                    to="offers">
                    Find & Offer
                </Link>
                {loginButton}
                <Popper open={open} anchorEl={anchorRef.current} placement='bottom-end' role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList style={{paddingRight:10, paddingLeft: 10}} autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem className={classes.menuItem} onClick={handleClose}>
                                    <Link className={classes.menuLink} to="/user">My Profile</Link>
                                </MenuItem>
                                <Divider variant="middle"/>
                                <MenuItem className={classes.menuItem} onClick={handleClose}>
                                    <Link className={classes.menuLink} to="/logout">Logout</Link>
                                </MenuItem>
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                     )}
                </Popper>  
            </Toolbar>
        </AppBar>
    )

}

export default NavBar;