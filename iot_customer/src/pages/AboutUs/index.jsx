import React from "react";

export default function AboutUs() {
  return (
    <div className="bg-white rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-gray-700 text-lg mb-6">
        Our Smart Parking System is built to make vehicle entry and exit faster,
        smarter, and more secure. Using RFID technology and real-time communication
        via MQTT, we aim to streamline the parking experience for both users and facility managers.
      </p>

      <h2 className="text-xl font-semibold mb-2">What We Do</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>Use RFID cards for seamless vehicle identification</li>
        <li>Control entry/exit barriers automatically</li>
        <li>Enable secure communication over Wi-Fi using TLS</li>
        <li>Provide a user-friendly dashboard for monitoring logs and transactions</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
      <p className="text-gray-700">
        To reduce parking congestion and improve vehicle flow efficiency by integrating
        IoT technology into modern parking infrastructure.
      </p>
    </div>
  );
}
