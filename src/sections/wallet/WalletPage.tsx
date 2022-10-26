import { Page } from "../../components/Layout/Page/Page"
import { WalletHeader } from "./header/WalletHeader"
import { WalletTabs } from "./header/WalletTabs"
import { useMatchRoute } from "@tanstack/react-location"
import { Navigation } from "utils/navigation"
import { WalletVesting } from "./vesting/WalletVesting"

export const WalletPage = () => {
  const matchRoute = useMatchRoute()

  return (
    <Page>
      <WalletHeader />
      <WalletTabs />
      {matchRoute({ to: Navigation.walletVesting }) && <WalletVesting />}
    </Page>
  )
}
