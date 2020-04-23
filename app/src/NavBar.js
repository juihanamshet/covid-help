import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Toolbar, AppBar, Typography, MenuList, Divider, MenuItem, Popper, Paper, Grow, ClickAwayListener } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

const useStyles = makeStyles(theme => ({
    // alts: appBar, titleText, tab
    root: {
        flexGrow: 1,
    },
    icon: {
        height: 20,
        width: 20,
        verticalAlign: "inherit",
    },
    appBar: {
        backgroundColor: 'white',
    },
    appBarAlt: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
    },
    titleDiv: {
        flexGrow: 1,
    },
    title: {
        "&:hover": {
            textDecoration: 'none',
        }
    },
    titleText: {
        color: theme.palette.primary.main,
        "&:hover": {
            color: theme.palette.primary.light,
            textDecoration: 'none',
        }
    },
    titleTextAlt: {
        color: theme.palette.primary.supaLight,
        "&:hover": {
            color: theme.palette.primary.main,
            textDecoration: 'none',
        }
    },
    tab: {
        color: theme.palette.primary.main,
        paddingRight: 15,
        fontWeight: 500,
        "&:hover": {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
        }
    },
    tabAlt: {
        color: theme.palette.primary.supaLight,
        paddingRight: 15,
        fontWeight: 500,
        "&:hover": {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
        }
    },
    menuItem: {
        marginBottom: 2.5,
        marginTop: 2.5
    },
    menuLink: {
        color: theme.palette.primary.main,
        "&:hover": {
            color: theme.palette.primary.dark,
            textDecoration: 'none'
        }
    },
}));

const NavBar = (props) => {
    const classes = useStyles();
    const { authState, authService } = useOktaAuth();
    const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [firstTimer = { notLoaded: true }, setFirstTimer] = React.useState(null);
    const location = useLocation();


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

    const onLogoHover = (e) => {
        let cur = e.target.querySelector('img');
        if (cur) {
            cur.src = props.alt ? (process.env.PUBLIC_URL + "/home.png") : (process.env.PUBLIC_URL + "/home-hover.png")
        }
    }

    const onLogoOut = (e) => {
        let cur = e.target.querySelector('img');
        if (cur) {
            cur.src = !props.alt ? (process.env.PUBLIC_URL + "/home.png") : (process.env.PUBLIC_URL + "/home-alt.png")
        }
    }


    // useEffect works by taking the second argument (open), and only applying the function when that given value changes
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;

        if (authState.isAuthenticated && location.pathname !== '/user') {
            const getUserInfo = () => {
                authService.getUser()
                    .then(result => {
                        if (result.getFirstTimer) {
                            setFirstTimer(true);
                        } else {
                            setFirstTimer(false);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
            getUserInfo()
        }
    }, [open]);

    if (firstTimer && location.pathname != "/user") {
        return (<Redirect to="/user"></Redirect>)
    }

    const loginButton = !authState.isAuthenticated ?
        <Link className={props.alt ? classes.tabAlt : classes.tab} to="/login">Login</Link> :
        <Link
            ref={anchorRef}
            onMouseOver={handleToggle}
            className={props.alt ? classes.tabAlt : classes.tab}
            to="/user">
            User
        </Link>;

    return (
        <AppBar className={props.alt ? classes.appBarAlt : classes.appBar} position="sticky">
            <Toolbar>
                <div className={classes.titleDiv}>
                    <Link
                        className={classes.title}
                        to="/"
                        onMouseOver={onLogoHover}
                        onMouseOut={onLogoOut}
                    >
                        <Typography className={props.alt ? classes.titleTextAlt : classes.titleText} variant="h5">
                            <img className={classes.icon}
                                alt="logo"
                                src={props.alt ? process.env.PUBLIC_URL + "/home-alt.png" : process.env.PUBLIC_URL + "/home.png"}
                            />&nbsp;Aiso
                        </Typography>
                    </Link>
                </div>
                <div className={classes.titleDiv}></div>
                <Link
                    className={props.alt ? classes.tabAlt : classes.tab}
                    to="/">
                    About Us
                </Link>
                <Link
                    className={props.alt ? classes.tabAlt : classes.tab}
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
                                    <MenuList style={{ paddingRight: 10, paddingLeft: 10 }} autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem className={classes.menuItem} onClick={handleClose}>
                                            <Link className={classes.menuLink} to="/user">My Profile</Link>
                                        </MenuItem>
                                        <Divider variant="middle" />
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