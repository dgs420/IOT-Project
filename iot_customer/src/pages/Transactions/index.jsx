import React, { useState } from "react";

import ClientTransactions from "./components/ClientTransactions";

const Transactions = () => {
  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <ClientTransactions />
      </div>
    </>
  );
};

export default Transactions;
