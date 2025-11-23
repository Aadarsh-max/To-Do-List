import React, { useState } from "react";
import { FiCoffee } from "react-icons/fi";
import { MdLocalCafe, MdRestaurant,MdFastfood } from "react-icons/md";
import { GiChocolateBar,GiPizzaSlice } from "react-icons/gi";
import { Link } from "react-router-dom";

// Donate options
const donateOptions = [
  {
    name: "Buy me a Coffee",
    amount: "Donate with BuyMeACoffee",
    link: "https://www.buymeacoffee.com/aadarshshrr",
    icon: <FiCoffee className="w-10 h-10 text-yellow-500" />,
    type: "link",
  },
  {
    name: "Buy me a Tea",
    amount: "₹30",
    qrSrc: "/gpay-tea-30.png",
    icon: <MdLocalCafe className="w-10 h-10 text-green-500" />,
    type: "qr",
  },
  {
    name: "Buy me a Chocolate",
    amount: "₹100",
    qrSrc: "/gpay-meal-100.png",
    icon: <GiChocolateBar className="w-10 h-10 text-red-500" />,
    type: "qr",
  },
  {
    name: "Buy me a Burger",
    amount: "₹150",
    qrSrc: "/gpay-150.png",
    icon: <MdFastfood className="w-10 h-10 text-orange-500" />,
    type: "qr",
  },
  {
    name: "Buy me a Pizza",
    amount: "₹200",
    qrSrc: "/gpay-200.png",
    icon: <GiPizzaSlice className="w-10 h-10 text-blue-500" />,
    type: "qr",
  },
  {
    name: "Buy me a Dinner",
    amount: "₹500",
    qrSrc: "/gpay-500.png",
    icon: <MdRestaurant className="w-10 h-10 text-purple-500" />,
    type: "qr",
  },
];

const Donate = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpenModal = (option) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-base-content">
        Support Us
      </h1>
      <p className="text-center text-base-content/70 mb-10 max-w-xl mx-auto">
        Show your support
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {donateOptions.map((option, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300 rounded-xl p-6 flex flex-col items-center gap-4"
          >
            {option.icon}
            <h2 className="text-xl font-semibold">{option.name}</h2>
            <p className="text-base-content/70">{option.amount}</p>

            {option.type === "link" ? (
              <a
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                Donate
              </a>
            ) : (
              <button
                onClick={() => handleOpenModal(option)}
                className="btn btn-secondary w-full"
              >
                Donate
              </button>
            )}
          </div>
        ))}
      </div>

      {modalOpen && selectedOption && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-xl shadow-xl relative max-w-md w-full max-h-screen overflow-auto flex flex-col items-center p-6">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedOption.name}
            </h2>
            <p className="text-center mb-4 text-base-content/70">
              Scan the QR code below to pay via GPay
            </p>

            <div className="flex justify-center mb-4 w-full">
              <img
                src={selectedOption.qrSrc}
                alt={`${selectedOption.name} QR`}
                className="w-72 sm:w-80 md:w-96 h-auto"
              />
            </div>
            <p className="text-center text-sm text-base-content/60">
              GPay ID: <span className="font-mono">adarshrivastav.4545@okaxis</span>
            </p>
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/home" className="btn btn-outline btn-accent">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Donate;
