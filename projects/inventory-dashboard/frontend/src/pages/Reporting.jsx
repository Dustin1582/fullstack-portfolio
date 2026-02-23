import PurchaseStats from "../components/PurchaseStats"
import UserStats from "../components/UserStats"
import "../css/Reporting.css"

const Reporting = ({confirmedOrder, registerUser, dbFiles}) => {
  return (
    <div className="reporting-container">
      <div className="top-row">
        <section className="purchase-stats">
            <PurchaseStats confirmedOrder={confirmedOrder}/>
        </section>
        <section>
          <UserStats registerUser={registerUser} dbFiles={dbFiles}/>
        </section>
      </div>
    </div>
  )
}

export default Reporting
