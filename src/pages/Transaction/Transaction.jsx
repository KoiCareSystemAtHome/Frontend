import React, { use } from "react";
import TransactionTable from "./TransactionTable";
import useTransactionList from "../../hooks/useTransactionList";
import WithdrawTable from "./WithdrawTable";
import WithdrawButton from "./WithdrawButton";
import useWithdrawByUserList from "../../hooks/useWithdrawByUserList";

const Transaction = () => {
  const transactionList = useTransactionList();
  const withdrawByUSerList = useWithdrawByUserList();

  return (
    <div>
      <div
        className="font-semibold mb-4 ml-4 text-2xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Giao Dịch</div>

        <div
          style={{
            display: "flex",
          }}
        >
          {/* <MemberButton /> */}
        </div>
      </div>
      <div className="searchContainer">{/* <SearchTable /> */}</div>
      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <TransactionTable dataSource={transactionList} />
      </div>

      <div
        className="font-semibold mb-4 ml-4 text-2xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Rút Tiền</div>

        <div
          style={{
            display: "flex",
          }}
        >
          <WithdrawButton />
        </div>
      </div>
      <div className="tableContainer" style={{ marginTop: "10px" }}>
        <WithdrawTable dataSource={withdrawByUSerList} />
      </div>
    </div>
  );
};

export default Transaction;
