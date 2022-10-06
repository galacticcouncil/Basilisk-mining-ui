import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { AssetInput } from "components/AssetInput/AssetInput"
import { Icon } from "components/Icon/Icon"
import { Text } from "components/Typography/Text/Text"
import { FC, ReactNode } from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  SContainer,
  SMaxButton,
  SSelectAssetButton,
} from "./PoolAddLiquidityAssetSelect.styled"
import { u32 } from "@polkadot/types"
import BigNumber from "bignumber.js"
import { getFloatingPointAmount } from "utils/balance"

type Props = {
  name: string
  asset: u32 | string
  balance: BigNumber | undefined
  decimals: number
  currency: { short: string; full: string }
  assetIcon: ReactNode
  value: string
  className?: string
  onChange: (v: string) => void
}

export const PoolAddLiquidityAssetSelect: FC<Props> = (props) => {
  const { t } = useTranslation()

  return (
    <SContainer className={props.className}>
      <div
        sx={{ flex: "row", items: "center", justify: "space-between", mb: 11 }}
      >
        <Text fw={600} lh={22} color="primary200">
          {t("selectAsset.title")}
        </Text>
        <div sx={{ flex: "row", items: "center" }}>
          <Text fs={12} lh={16} color="white" sx={{ mr: 5 }}>
            <Trans
              t={t}
              i18nKey="selectAsset.balance"
              tOptions={{
                balance: props.balance,
                decimalPlaces: 4,
                fixedPointScale: props.decimals,
              }}
            >
              <span css={{ opacity: 0.7 }} />
            </Trans>
          </Text>
          <SMaxButton
            size="micro"
            text={t("selectAsset.button.max")}
            capitalize
            onClick={() => {
              if (props.balance != null) {
                props.onChange(
                  getFloatingPointAmount(props.balance, props.decimals).toFixed(
                    4,
                  ),
                )
              }
            }}
          />
        </div>
      </div>
      <div sx={{ flex: "row", items: "center", justify: "space-between" }}>
        <SSelectAssetButton size="small">
          <Icon icon={props.assetIcon} sx={{ mr: 10 }} />
          <div sx={{ mr: 6 }}>
            <Text fw={700} color="white">
              {props.currency.short}
            </Text>
            <Text color="neutralGray400" fs={12} lh={14}>
              {props.currency.full}
            </Text>
          </div>
          <Icon icon={<ChevronDown />} />
        </SSelectAssetButton>
        <AssetInput
          value={props.value}
          name={props.name}
          label={t("selectAsset.input.label")}
          onChange={props.onChange}
          dollars="1234 USD"
          unit={props.currency.short}
        />
      </div>
    </SContainer>
  )
}
