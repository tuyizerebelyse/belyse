import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} SIMS. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
