/* eslint-disable jsx-a11y/alt-text */
import {
    Divider,
    menu,
} from "@nextui-org/react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsersLine } from "react-icons/fa6";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";
import { TbTruckDelivery } from "react-icons/tb";
import { FaNetworkWired } from "react-icons/fa6";
import { FiChevronDown, FiChevronRight, FiPackage, FiMapPin, FiList, FiFileText, FiBox, FiClock } from "react-icons/fi";

interface Menu {
    title: string;
    icon: JSX.Element;
    href?: string;
    subMenus?: SubMenu[];
}

interface SubMenu {
    title: string;
    href: string;
}

interface SidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const { logout } = useAuth()
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [selectItem, setSelectItem] = useState<string | undefined>();
    const navigate = useNavigate();

    const Menus: Menu[] = [
        {
            title: "Users",
            icon: <FaUsersLine className="w-7 text-sky-600 h-7" />,
            href: "/users",
        },
        {
            title: "Companies",
            icon: <FaNetworkWired className="w-7 text-sky-600 h-7" />,
            href: "/companies",
        },
        {
            title: "Drivers",
            icon: <TbTruckDelivery className="w-7 text-sky-600 h-7" />,
            href: "/drivers",
        },
        {
            title: "Shipments",
            icon: <FiPackage className="w-7 text-sky-600 h-7" />,
            subMenus: [
                { title: "All Shipments", href: "/shipments" },
                { title: "Ports", href: "/shipment/ports" },
                { title: "Steps", href: "/shipment/steps" },
                { title: "Document Types", href: "/shipment/document-types" },
                { title: "Containers", href: "/shipment/containers" },
                { title: "Step History", href: "/shipment/steps" },
            ],
        },
    ];

    const toggleMenu = (title: string) => {
        if (expandedMenu === title) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(title);
        }
    };

    const handleNavigation = (href: string, title: string) => {
        navigate(href);
        setSelectItem(title);
    };

    return (
        <div
            className={`hidden md:block ${open ? "w-72" : "w-20"} bg-gray-900 p-5 relative pt-14 duration-300 border-r border-gray-700`}
        >
            <img
                src="/assets/control.png"
                className={`absolute cursor-pointer -right-3 top-9 w-7 border-blue-500 border-2 rounded-full ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
            />
            <div className="flex gap-x-4 items-center">
                <img
                    src="/R.png"
                    className={`cursor-pointer h-10 w-10 duration-500 ${open && "rotate-[360deg]"}`}
                />
                <h1
                    className={`text-gray-200 origin-left font-medium text-base duration-200 ${!open && "scale-0"}`}
                >
                    Rahtash
                </h1>
            </div>
            <Divider className="bg-gray-700 mt-8" />
            <ul className="pt-6">
                {Menus.map((Menu, index) => (
                    <React.Fragment key={index}>
                        <li
                            className={`flex rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-700 text-gray-200 text-lg items-center gap-x-4 
                                        ${Menu.title === selectItem ? "bg-gray-700" : ""}`}
                            onClick={() => {
                                if (Menu.href) {
                                    handleNavigation(Menu.href, Menu.title);
                                } else if (Menu.subMenus) {
                                    toggleMenu(Menu.title);
                                }
                            }}
                        >
                            {Menu.icon}
                            <span className={`${!open && "hidden"} origin-left duration-200 flex-1`}>
                                {Menu.title}
                            </span>
                            {Menu.subMenus && open && (
                                expandedMenu === Menu.title ? (
                                    <FiChevronDown className="text-gray-400" />
                                ) : (
                                    <FiChevronRight className="text-gray-400" />
                                )
                            )}
                        </li>

                        {Menu.subMenus && expandedMenu === Menu.title && open && (
                            <ul className="ml-8 mb-2">
                                {Menu.subMenus.map((subMenu, subIndex) => (
                                    <li
                                        key={subIndex}
                                        className={`flex rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-700 text-gray-200 text-sm items-center gap-x-4 
                                                    ${subMenu.title === selectItem ? "bg-gray-700" : ""}`}
                                        onClick={() => handleNavigation(subMenu.href, subMenu.title)}
                                    >
                                        {/* Icons for submenus */}
                                        {subMenu.title.includes("Shipments") && <FiPackage className="w-5 text-sky-400 h-5" />}
                                        {subMenu.title === "Ports" && <FiMapPin className="w-5 text-sky-400 h-5" />}
                                        {subMenu.title === "Steps" && <FiList className="w-5 text-sky-400 h-5" />}
                                        {subMenu.title === "Document Types" && <FiFileText className="w-5 text-sky-400 h-5" />}
                                        {subMenu.title === "Containers" && <FiBox className="w-5 text-sky-400 h-5" />}
                                        {subMenu.title === "Step History" && <FiClock className="w-5 text-sky-400 h-5" />}
                                        
                                        <span>{subMenu.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </React.Fragment>
                ))}

                <li
                    className={`flex rounded-md p-2 mb-8 cursor-pointer hover:bg-gray-700 text-gray-200 text-lg items-center gap-x-4`}
                    onClick={logout}
                >
                    <BiLogOutCircle className="w-7 text-blue-400 h-7" />
                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                        Log out
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;