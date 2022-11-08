import { ReactComponent as BuyIcon } from "assets/icons/BuyIcon.svg"
import { ReactComponent as SellIcon } from "assets/icons/SellIcon.svg"
import { ReactComponent as TransferIcon } from "assets/icons/TransferIcon.svg"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"
import { ReactComponent as ChevronDownIcon } from "assets/icons/ChevronDown.svg"
import { ReactComponent as ChevronRightIcon } from "assets/icons/ChevronRight.svg"
import { useTranslation } from "react-i18next"
import { TableAction } from "components/Table/Table"

type Props = {
  toggleExpanded: () => void
  symbol: string
  onTransferClick: () => void
}

export const WalletAssetsTableActions = (props: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <div sx={{ display: ["block", "none"] }}>
        <ButtonTransparent
          onClick={() => console.log("detail", props.symbol)}
          css={{ color: theme.colors.iconGray }}
        >
          <ChevronRightIcon />
        </ButtonTransparent>
      </div>
      <div sx={{ flex: "row", gap: 10, display: ["none", "flex"] }}>
        <TableAction
          icon={<BuyIcon />}
          onClick={() => console.log("buy", props.symbol)}
        >
          {t("wallet.assets.table.actions.buy")}
        </TableAction>
        <TableAction
          icon={<SellIcon />}
          onClick={() => console.log("sell", props.symbol)}
        >
          {t("wallet.assets.table.actions.sell")}
        </TableAction>
        {
          <>
            <TableAction
              icon={<TransferIcon />}
              onClick={props.onTransferClick}
            >
              {t("wallet.assets.table.actions.transfer")}
            </TableAction>
          </>
        }
        <ButtonTransparent
          onClick={props.toggleExpanded}
          css={{ color: theme.colors.iconGray }}
        >
          <ChevronDownIcon />
        </ButtonTransparent>
      </div>
    </>
  )
}
