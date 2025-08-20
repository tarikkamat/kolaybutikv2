import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, DropdownMenu, DropdownToggle, Form, Button} from 'reactstrap';
import { ShepherdTourContext } from 'react-shepherd';

//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
import MyCartDropdown from '../Components/Common/MyCartDropdown';
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';

import {changeSidebarVisibility} from '../slices/thunks';
import {useDispatch, useSelector} from "react-redux";
import {createSelector} from 'reselect';
import { useGlobalTour } from '../Components/Context/TourContext';

const Header = ({onChangeLayoutMode, layoutModeType, headerClass}) => {
    const dispatch = useDispatch();
    const { startTour, hasTour, isLoading } = useGlobalTour();
    const shepherdTour = useContext(ShepherdTourContext);

    const selectDashboardData = createSelector(
        (state) => state.Layout,
        (state) => ({
            sidebarVisibilitytype: state.sidebarVisibilitytype
        })
    );
    // Inside your component
    const {sidebarVisibilitytype} = useSelector(selectDashboardData);


    const [search, setSearch] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    
    // Blinking effect for tour button
    useEffect(() => {
        if (hasTour && shepherdTour) {
            const blinkInterval = setInterval(() => {
                setIsBlinking(prev => !prev);
            }, 1000); // Blink every 1 second
            
            return () => clearInterval(blinkInterval);
        }
    }, [hasTour, shepherdTour]);

    const toogleSearch = () => {
        setSearch(!search);
    };

    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        dispatch(changeSidebarVisibility("show"));

        if (windowSize > 767)
            document.querySelector(".hamburger-icon").classList.toggle('open');

        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }

        //For collapse vertical and semibox menu
        if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute('data-layout') === "vertical" || document.documentElement.getAttribute('data-layout') === "semibox")) {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }


        //Two column menu
        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };

    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box horizontal-logo ms-4">
                                <Link to="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="32"/>
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="32"/>
                                    </span>
                                </Link>

                                <Link to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22"/>
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17"/>
                                    </span>
                                </Link>
                            </div>

                            <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>

                        <div className="d-flex align-items-center">

                            <Dropdown isOpen={search} toggle={toogleSearch}
                                      className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button"
                                                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                       aria-label="Recipient's username"/>
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown>
                            {/* Tour Button */}
                            {hasTour && shepherdTour && (
                                <Button
                                    onClick={() => {
                                        console.log('Header tour button clicked, shepherdTour:', shepherdTour);
                                        startTour();
                                    }}
                                    disabled={isLoading}
                                    className={`btn btn-icon btn-topbar btn-ghost-secondary me-2 ${isBlinking ? 'tour-button-blink' : ''}`}
                                    title="Sayfa Turunu Başlat"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        animation: isBlinking ? 'pulse 1s infinite' : 'none'
                                    }}
                                >
                                    Site Turunu Başlat
                                </Button>
                            )}

                            {/* MyCartDropdwon */}
                            <MyCartDropdown/>

                            {/* FullScreenDropdown */}
                            <FullScreenDropdown/>
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;