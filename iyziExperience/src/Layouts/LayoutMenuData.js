import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"

const Navdata = () => {
    const history = useNavigate()

    const [isStore, setIsStore] = useState(false)
    const [isUsers, setIsUsers] = useState(false)
    const [isInfrastructures, setIsInfrastructures] = useState(false)
    const [isUrls, setIsUrls] = useState(false)
    const [isUrlsQuery, setIsUrlsQuery] = useState(false)

    const [iscurrentState, setIscurrentState] = useState('store')

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu")
            const iconItems = ul.querySelectorAll(".nav-icon.active")
            let activeIconItems = [...iconItems]
            activeIconItems.forEach((item) => {
                item.classList.remove("active")
                let id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show")
            })
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel')
        if (iscurrentState !== 'store') {
            setIsStore(false)
        }
        if (iscurrentState !== 'users') {
            setIsUsers(false)
        }
        if (iscurrentState !== 'infrastructures') {
            setIsInfrastructures(false)
        }
        if (iscurrentState !== 'urls') {
            setIsUrls(false)
        }
        if (iscurrentState !== 'urlsQuery') {
            setIsUrlsQuery(false)
        }
    }, [
        history,
        iscurrentState,
        isStore,
        isUsers,
        isInfrastructures,
        isUrls,
        isUrlsQuery,
    ])

    const menuItems = [
        {
            id: "store",
            label: "Mağaza",
            icon: "ri-store-2-line",
            link: "/store",
            stateVariables: isStore,
            click: function (e) {
                e.preventDefault()
                setIsStore(!isStore)
                setIscurrentState('store')
                updateIconSidebar(e)
            }
        }
    ]
    return <React.Fragment>{menuItems}</React.Fragment>
}
export default Navdata
