/* eslint-disable jsx-a11y/alt-text */
import {
    Divider,
    menu,
} from "@nextui-org/react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  FaNetworkWired, FaAddressCard, FaFolder, FaFileAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";
import { TbTruckDelivery } from "react-icons/tb";
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
    icon?: JSX.Element;
}

interface SidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const { logout } = useAuth()
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        users: false,
        companies: false,
        drivers: false,
        shipments: false
    });
    const [selectItem, setSelectItem] = useState<string | undefined>();
    const navigate = useNavigate();

    const Menus: Menu[] = [
        {
            title: "Users",
            icon: <FaUsers className="w-7 text-sky-600 h-7" />,
            subMenus: [
                { 
                    title: "Users List", 
                    href: "/users",
                    icon: <FaUsers className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Address", 
                    href: "/users/address",
                    icon: <FaAddressCard className="w-5 text-sky-400 h-5" />
                },
            ],
        },
        {
            title: "Companies",
            icon: <FaNetworkWired className="w-7 text-sky-600 h-7" />,
            subMenus: [
                { 
                    title: "Companies List", 
                    href: "/companies",
                    icon: <FaNetworkWired className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Categories", 
                    href: "/company/categories",
                    icon: <FaFolder className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Documents", 
                    href: "/company/documents",
                    icon: <FaFileAlt className="w-5 text-sky-400 h-5" />
                },
            ],
        },
        {
            title: "Drivers",
            icon: <TbTruckDelivery className="w-7 text-sky-600 h-7" />,
            subMenus: [
                { 
                    title: "Drivers List", 
                    href: "/drivers",
                    icon: <TbTruckDelivery className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Categories", 
                    href: "/driver/categories",
                    icon: <FaFolder className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Documents", 
                    href: "/driver/documents",
                    icon: <FaFileAlt className="w-5 text-sky-400 h-5" />
                },
            ],
        },
        {
            title: "Shipments",
            icon: <FiPackage className="w-7 text-sky-600 h-7" />,
            subMenus: [
                { 
                    title: "All Shipments", 
                    href: "/shipments",
                    icon: <FiPackage className="w-5 text-sky-400 h-5" />
                },
  
                { 
                    title: "Ports", 
                    href: "/shipment/ports",
                    icon: <FiMapPin className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Steps", 
                    href: "/shipment/steps",
                    icon: <FiList className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Document Types", 
                    href: "/shipment/document-types",
                    icon: <FiFileText className="w-5 text-sky-400 h-5" />
                },
                { 
                    title: "Containers", 
                    href: "/shipment/containers",
                    icon: <FiBox className="w-5 text-sky-400 h-5" />
                },
                // { 
                //     title: "Step History", 
                //     href: "/shipment/step-history",
                //     icon: <FiClock className="w-5 text-sky-400 h-5" />
                // },
            ],
        },
    ];

    const toggleMenu = (title: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [title.toLowerCase()]: !prev[title.toLowerCase()]
        }));
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
                                expandedMenus[Menu.title.toLowerCase()] ? (
                                    <FiChevronDown className="text-gray-400" />
                                ) : (
                                    <FiChevronRight className="text-gray-400" />
                                )
                            )}
                        </li>

                        {Menu.subMenus && expandedMenus[Menu.title.toLowerCase()] && open && (
                            <ul className="ml-8 mb-2">
                                {Menu.subMenus.map((subMenu, subIndex) => (
                                    <li
                                        key={subIndex}
                                        className={`flex rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-700 text-gray-200 text-sm items-center gap-x-4 
                                                    ${subMenu.title === selectItem ? "bg-gray-700" : ""}`}
                                        onClick={() => handleNavigation(subMenu.href, subMenu.title)}
                                    >
                                        {subMenu.icon || <FiPackage className="w-5 text-sky-400 h-5" />}
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