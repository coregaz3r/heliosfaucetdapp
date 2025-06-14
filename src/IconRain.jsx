// src/IconRain.jsx

import React, { useState, useEffect } from 'react';

const IconRain = () => {
  const [icons, setIcons] = useState([]);
  const numberOfIcons = 30; // Jumlah ikon yang akan jatuh

  useEffect(() => {
    const generateIcons = () => {
      const newIcons = [];
      for (let i = 0; i < numberOfIcons; i++) {
        newIcons.push({
          id: i,
          // Properti acak untuk setiap ikon
          left: `${Math.random() * 100}%`, // Posisi horizontal acak
          animationDuration: `${Math.random() * 5 + 5}s`, // Durasi jatuh acak (5-10 detik)
          animationDelay: `${Math.random() * 10}s`, // Waktu tunda acak (0-10 detik)
          opacity: Math.random() * 0.5 + 0.2, // Opasitas acak (0.2 - 0.7)
          size: `${Math.random() * 20 + 10}px`, // Ukuran acak (10px - 30px)
        });
      }
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="rain-container" aria-hidden="true">
      {icons.map(icon => (
        <div
          key={icon.id}
          className="falling-icon"
          style={{
            left: icon.left,
            width: icon.size,
            height: icon.size,
            opacity: icon.opacity,
            animationDuration: icon.animationDuration,
            animationDelay: icon.animationDelay,
            backgroundImage: `url('/helios-icon.png')`, // Memuat ikon dari folder public
          }}
        />
      ))}
    </div>
  );
};

export default IconRain;