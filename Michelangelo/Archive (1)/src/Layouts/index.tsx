import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withRouter from '../Components/Common/withRouter';

// Import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Import actions
import {
    changeLayout,
    changeSidebarTheme,
    changeLayoutMode,
} from "../slices/thunks";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

const Layout = (props: any) => {
    const [headerClass, setHeaderClass] = useState<any>("");
    const dispatch: any = useDispatch();
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
    const selectLayoutState = (state: any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            layoutType: layout.layoutType,
            leftSidebarType: layout.leftSidebarType,
            // layoutModeType: layout.layoutModeType,
            // layoutWidthType: layout.layoutWidthType,
            // layoutPositionType: layout.layoutPositionType,
            // topbarThemeType: layout.topbarThemeType,
            // leftsidbarSizeType: layout.leftsidbarSizeType,
            // leftSidebarViewType: layout.leftSidebarViewType,
            // leftSidebarImageType: layout.leftSidebarImageType,
            // preloader: layout.preloader,
            // sidebarVisibilitytype: layout.sidebarVisibilitytype,
        })
    );

    const {
        layoutType,
        leftSidebarType,
        // layoutModeType,
        // layoutWidthType,
        // layoutPositionType,
        // topbarThemeType,
        // leftsidbarSizeType,
        // leftSidebarViewType,
        // leftSidebarImageType,
        // sidebarVisibilitytype
    } = useSelector(selectLayoutProperties);

    useEffect(() => {
        if (
            layoutType ||
            leftSidebarType  )
            // layoutModeType ||
            // layoutWidthType ||
            // layoutPositionType ||
            // topbarThemeType ||
            // leftsidbarSizeType ||
            // leftSidebarViewType ||
            // leftSidebarImageType ||
            // sidebarVisibilitytype
        {
            window.dispatchEvent(new Event('resize'));
            // dispatch(changeLeftsidebarViewType(leftSidebarViewType));
            // dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
            dispatch(changeSidebarTheme(leftSidebarType));
            // dispatch(changeLayoutMode(layoutModeType));
            // dispatch(changeLayoutWidth(layoutWidthType));
            // dispatch(changeLayoutPosition(layoutPositionType));
            // dispatch(changeTopbarTheme(topbarThemeType));
            dispatch(changeLayout(layoutType));
            // dispatch(changeSidebarImageType(leftSidebarImageType));
            // dispatch(changeSidebarVisibility(sidebarVisibilitytype));
        }
    }, [
        layoutType,
        leftSidebarType,
        // layoutModeType,
        // layoutWidthType,
        // layoutPositionType,
        // topbarThemeType,
        // leftsidbarSizeType,
        // leftSidebarViewType,
        // leftSidebarImageType,
        // sidebarVisibilitytype,
        dispatch
    ]);

    const onChangeLayoutMode = (value: any) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
        return () => {
            window.removeEventListener("scroll", scrollNavigation, true);
        };
    }, []);

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 30) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    useEffect(() => {
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        if ( layoutType === "vertical" || layoutType === "twocolumn") {
            humberIcon.classList.remove('open');
        } else {
            humberIcon && humberIcon.classList.add('open');
        }
    }, [ layoutType]);


    const toggleScrolling = (enable: boolean) => {
        document.body.style.overflow = enable ? 'auto' : 'hidden';
    };


    const handleToggleClick = () => {
        toggleScrolling(false);
    };

    return (
        <React.Fragment>
            <div id="layout-wrapper" style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header
                    headerClass={headerClass}
                    // layoutModeType={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode}
                />
                <Sidebar layoutType={layoutType} />
                <div className="main-content" style={{
                    flexGrow: 1,
                    overflow: isSidebarMinimized ? 'hidden' : 'auto',
                    paddingBottom:'40px',
                    position:'relative'
                }}>
                    {props.children}
                </div>

                <Footer />
            </div>
        </React.Fragment>
    );

};

Layout.propTypes = {
    children: PropTypes.object,
};

export default withRouter(Layout);