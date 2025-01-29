import React, { useState } from "react";
import { FaTruck, FaShip, FaMapMarkerAlt, FaBorderAll, FaInbox, FaCheckCircle, FaHome } from "react-icons/fa";

const ShipmentTrace = () => {
  const [completedStep, setCompletedStep] = useState(1); // Change this value to dynamically set the completed steps.

  // List of steps
  const steps = [
    { title: "Factory", icon: <FaHome className="w-4 h-4" /> },
    { title: "loading", icon: <FaMapMarkerAlt className="w-4 h-4" /> },
    { title: "on ship", icon: <FaShip className="w-4 h-4" /> },
    { title: "discharge", icon: <FaMapMarkerAlt className="w-4 h-4" /> },
    { title: "on truck", icon: <FaTruck className="w-4 h-4" /> },
    { title: "Exit border", icon: <FaBorderAll className="w-4 h-4" /> },
    { title: "destination", icon: <FaInbox className="w-4 h-4" /> },
    { title: "Completed", icon: <FaCheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-row items-center overflow-hidden ">
      <ol className="flex flex-wrap items-center justify-center w-full text-xs text-gray-900 font-medium sm:text-base ">
        {steps.map((step, index) => {
          const isActive = index <= completedStep; 
          const colorClass = isActive ? "text-green-600" : "text-black";
          const backgroundClass = isActive ? "bg-green-600" : "bg-gray-50";
          const borderClass = isActive ? "border-transparent" : "border-gray-800";

          return (
            <li key={index} className={`flex w-1/4 relative ${colorClass} after:content-[''] mb-10 mt-10 after:w-full after:h-0.5 ${isActive ? 'after:bg-green-600' : 'after:bg-gray-800'} after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4`}>
              <div className="block whitespace-nowrap z-10 text-center">
                <span className={`w-6 h-6 ${backgroundClass} border-2 ${borderClass} rounded-full flex justify-center items-center mx-auto mb-2 text-sm ${isActive ? 'text-white' : 'text-black'} lg:w-10 lg:h-10`}>
                  {step.icon}
                </span>
                <span className="text-sm lg:text-base">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ShipmentTrace;