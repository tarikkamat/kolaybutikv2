import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import withRouter from '../Components/Common/withRouter';
import { ShepherdTour } from 'react-shepherd';
import { TourProvider } from '../Components/Context/TourContext';

//import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

//import actions
import {
    changeLayout,
    changeLayoutMode,
    changeLayoutPosition,
    changeLayoutTheme,
    changeLayoutThemeColor,
    changeLayoutWidth,
    changeLeftsidebarSizeType,
    changeLeftsidebarViewType,
    changeSidebarImageType,
    changeSidebarTheme,
    changeSidebarVisibility,
    changeTopbarTheme,
} from "../slices/thunks";

//redux
import {useDispatch, useSelector} from "react-redux";
import {createSelector} from 'reselect';

const Layout = (props) => {
    const [headerClass, setHeaderClass] = useState("");
    const dispatch = useDispatch();

    const selectLayoutState = (state) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            layoutType: layout.layoutType,
            layoutThemeType: layout.layoutThemeType,
            layoutThemeColorType: layout.layoutThemeColorType,
            leftSidebarType: layout.leftSidebarType,
            layoutModeType: layout.layoutModeType,
            layoutWidthType: layout.layoutWidthType,
            layoutPositionType: layout.layoutPositionType,
            topbarThemeType: layout.topbarThemeType,
            leftsidbarSizeType: layout.leftsidbarSizeType,
            leftSidebarViewType: layout.leftSidebarViewType,
            leftSidebarImageType: layout.leftSidebarImageType,
            preloader: layout.preloader,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
        })
    );
    // Inside your component
    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        preloader,
        sidebarVisibilitytype,
        layoutThemeType,
        layoutThemeColorType
    } = useSelector(selectLayoutProperties);

    /*
    layout settings
    */
    useEffect(() => {
        if (
            layoutType ||
            leftSidebarType ||
            layoutModeType ||
            layoutWidthType ||
            layoutPositionType ||
            topbarThemeType ||
            leftsidbarSizeType ||
            leftSidebarViewType ||
            leftSidebarImageType ||
            sidebarVisibilitytype ||
            layoutThemeType ||
            layoutThemeColorType
        ) {
            window.dispatchEvent(new Event('resize'));
            dispatch(changeLeftsidebarViewType(leftSidebarViewType));
            dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
            dispatch(changeSidebarTheme(leftSidebarType));
            dispatch(changeLayoutThemeColor(layoutThemeColorType));
            dispatch(changeLayoutTheme(layoutThemeType));
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayoutWidth(layoutWidthType));
            dispatch(changeLayoutPosition(layoutPositionType));
            dispatch(changeTopbarTheme(topbarThemeType));
            dispatch(changeLayout(layoutType));
            dispatch(changeSidebarImageType(leftSidebarImageType));
            dispatch(changeSidebarVisibility(sidebarVisibilitytype));
        }
    }, [layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        layoutThemeType,
        layoutThemeColorType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype,
        dispatch]);
    /*
    call dark/light mode
    */
    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    // class add remove in header 
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    useEffect(() => {
        if (sidebarVisibilitytype === 'show' || layoutType === "vertical" || layoutType === "twocolumn") {
            document.querySelector(".hamburger-icon").classList.remove('open');
        } else {
            document.querySelector(".hamburger-icon") && document.querySelector(".hamburger-icon").classList.add('open');
        }
    }, [sidebarVisibilitytype, layoutType]);

    const tourOptions = {
        defaultStepOptions: {
            cancelIcon: {
                enabled: true
            },
            classes: 'shadow-md bg-purple-dark',
            scrollTo: { behavior: "smooth", block: "center" },
        },
        useModalOverlay: true
    };

    return (
        <React.Fragment>
            <ShepherdTour steps={[]} tourOptions={tourOptions}>
                <TourProvider>
                    <div id="layout-wrapper">
                        <Header
                            headerClass={headerClass}
                            layoutModeType={layoutModeType}
                            onChangeLayoutMode={onChangeLayoutMode}/>
                        <Sidebar
                            layoutType={layoutType}
                        />
                        <div className="main-content">
                            {props.children}
                            <Footer/>
                        </div>
                    </div>
                </TourProvider>
            </ShepherdTour>
        </React.Fragment>

    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default withRouter(Layout);