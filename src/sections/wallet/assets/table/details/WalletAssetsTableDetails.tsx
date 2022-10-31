import { Text } from "components/Typography/Text/Text"
import { theme } from "theme"
import { useTranslation } from "react-i18next"
import BN from "bignumber.js"

type Props = {
  origin: string
  locked: BN
  lockedUSD: BN
}

export const WalletAssetsTableDetails = ({
  origin,
  locked,
  lockedUSD,
}: Props) => {
  const { t } = useTranslation()

  return (
    <div sx={{ flex: "row" }}>
      <div sx={{ flex: "column", align: "end", m: "auto", gap: 8 }}>
        <Text fs={12} lh={14} fw={500} color="neutralGray300">
          Origin Chain:
        </Text>
        <Text fs={14} lh={18} fw={500} color="white">
          {origin}
        </Text>
      </div>
      <div
        css={{
          width: "1px",
          background: `rgba(${theme.rgbColors.white}, 0.06)`,
        }}
      />
      <div sx={{ m: "auto" }}>
        <Text fs={12} lh={14} fw={500} color="neutralGray300">
          Locked:
        </Text>
        <Text fs={14} lh={18} fw={500} color="white" sx={{ mt: 8 }}>
          {t("value", { value: locked })}
        </Text>
        <Text fs={12} lh={16} fw={500} color="neutralGray500" sx={{ mt: 2 }}>
          {t("value.usd", { amount: lockedUSD })}
        </Text>
      </div>
    </div>
  )
}
