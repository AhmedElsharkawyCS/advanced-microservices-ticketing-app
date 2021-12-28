import StripeCheckout from "react-stripe-checkout"
import { Button } from "@components/Buttons"

const stripePK = "pk_test_51DAcnfEVyvyNwkelxkOywsjowwN1os1rlVDwB245egofEm6qlBu6lNRJ9fqqYR7TxZ20INVFUsjisQfRaBZyMRkF00y2vPcC84"
export default function StripeButton({ onSubmit, disabled, amountInCents, user }) {
  if (disabled)
    return (
      <Button disabled={disabled} sx={{ width: "150px" }}>
        Pay ${amountInCents / 100}
      </Button>
    )
  return (
    <StripeCheckout
      email={user?.email}
      allowRememberMe
      token={onSubmit}
      stripeKey={stripePK}
      zipCode={false}
      currency='USD'
      amount={amountInCents}
      label='Pay with 💳'
      image={"https://qualityinspection.org/wp-content/uploads/2012/01/HowtoPayChineseSuppliersbyBankTransferTT.jpg"}
    >
      <Button>Pay ${amountInCents / 100}</Button>
    </StripeCheckout>
  )
}
