import StripeCheckout from "react-stripe-checkout"
import { Button } from "@components/Buttons"

const stripePK = "pk_test_51DAcnfEVyvyNwkelxkOywsjowwN1os1rlVDwB245egofEm6qlBu6lNRJ9fqqYR7TxZ20INVFUsjisQfRaBZyMRkF00y2vPcC84"
export default function StripeButton({ onSubmit, disabled, amountInCents }) {
  return (
    <StripeCheckout allowRememberMe token={onSubmit} stripeKey={stripePK} zipCode={false} currency='USD' amount={amountInCents} panelLabel='Pay'>
      <Button disabled={disabled}>Pay {amountInCents / 100} $</Button>
    </StripeCheckout>
  )
}
