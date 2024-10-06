import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState(null);

  const handleMouseEnter = (item) => {
    setActive(item);
  };

  const handleMouseLeave = () => {
    setActive(null);
  };

  return (
    <nav
      className="bg-black text-white shadow-md  flex justify-end items-center py-4 px-8 transition duration-300"
      onMouseLeave={handleMouseLeave}
    >
      {["Help Us", "Contact Us", "About Us"].map((item) => (
        <div
          key={item}
          className="relative mr-6" // Margin for spacing
          onMouseEnter={() => handleMouseEnter(item)}
        >
          <motion.p
            className="cursor-pointer hover:underline transition duration-200"
            whileHover={{ scale: 1.1 }} // Scale effect on hover
            onClick={() => setActive(item)} // Set active on click for smooth transition
          >
            {item}
          </motion.p>
          {active === item && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-black shadow-lg rounded-lg p-4 z-10"
            >
              <Link
                to={`/${item.replace(" ", "-").toLowerCase()}`}
                className="block text-sm hover:underline"
              >
                Learn More
              </Link>
            </motion.div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
