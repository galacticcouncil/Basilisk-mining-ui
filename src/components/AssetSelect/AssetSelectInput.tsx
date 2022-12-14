import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { AssetInput } from "components/AssetInput/AssetInput"
import { Icon } from "components/Icon/Icon"
import { Text } from "components/Typography/Text/Text"
import { ReactNode, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { SSelectAssetButton } from "./AssetSelectInput.styled"
import { u32 } from "@polkadot/types"
import BigNumber from "bignumber.js"
import { getFloatingPointAmount } from "utils/balance"
import { useUsdPeggedAsset } from "api/asset"
import { useSpotPrice } from "api/spotPrice"
import { Maybe } from "utils/helpers"
import { getAssetName } from "components/AssetIcon/AssetIcon"
import { TokenInputContainer, TokenInputMaxButton } from "./TokenInput"

export const AssetSelectInput = (props: {
  name: string
  value: string

  title: ReactNode
  className?: string

  asset: u32 | string
  assetName: Maybe<string>
  assetIcon: Maybe<ReactNode>
  decimals: Maybe<number>
  balance: Maybe<BigNumber>

  onChange: (v: string) => void
  onSelectAssetClick: () => void

  error?: string
}) => {
  const { t } = useTranslation()

  const usd = useUsdPeggedAsset()
  const spotPrice = useSpotPrice(props.asset, usd.data?.id)

  const aUSDValue = useMemo(() => {
    if (!props.value) return 0
    if (spotPrice.data?.spotPrice == null) return null
    return spotPrice.data.spotPrice.times(props.value)
  }, [props.value, spotPrice.data])

  return (
    <TokenInputContainer className={props.className}>
      <Text fw={500} lh={22} color="primary200" css={{ gridArea: "title" }}>
        {props.title}
      </Text>
      <div
        sx={{ flex: "row", align: "center", pt: [5, 0], justify: "end" }}
        css={{ gridArea: "balance" }}
      >
        <Text fs={12} lh={16} color="white" sx={{ mr: 5 }}>
          <Trans
            t={t}
            i18nKey="selectAsset.balance"
            tOptions={{
              balance: props.balance,
              fixedPointScale: props.decimals,
              type: "token",
            }}
          >
            <span css={{ opacity: 0.7 }} />
          </Trans>
        </Text>
        <TokenInputMaxButton
          onClick={() => {
            if (props.decimals != null && props.balance != null) {
              props.onChange(
                getFloatingPointAmount(props.balance, props.decimals).toFixed(
                  4,
                ),
              )
            }
          }}
        />
      </div>
      <div
        sx={{ flex: "row", align: "center", justify: "space-between" }}
        css={{ gridArea: "input" }}
      >
        <SSelectAssetButton size="small" onClick={props.onSelectAssetClick}>
          <Icon icon={props.assetIcon} />
          {props.assetName && (
            <div>
              <Text fw={700} color="white">
                {props.assetName}
              </Text>
              <Text
                css={{ whiteSpace: "nowrap" }}
                color="neutralGray400"
                fs={12}
                lh={14}
              >
                {getAssetName(props.assetName)}
              </Text>
            </div>
          )}
          <Icon icon={<ChevronDown />} />
        </SSelectAssetButton>
        <AssetInput
          name={props.name}
          label={t("selectAsset.input.label")}
          value={props.value}
          onChange={props.onChange}
          error={props.error}
          dollars={t("value.usd", { amount: aUSDValue })}
          unit={props.assetName}
          placeholder="0"
        />
      </div>
    </TokenInputContainer>
  )
}
