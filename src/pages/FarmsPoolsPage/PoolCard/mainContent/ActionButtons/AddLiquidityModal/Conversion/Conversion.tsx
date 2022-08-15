import { Box } from "components/Box/Box"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getFormattedNumber } from "utils/formatNumber"
import { ConversionWrapper } from "./Conversion.styled"

type ConversionProps = {
  firstValue: { amount: number; currency: string }
  secondValue: { amount: number; currency: string }
}

export const Conversion: FC<ConversionProps> = ({
  firstValue,
  secondValue,
}) => {
  const { t } = useTranslation()
  return (
    <Box flex relative height={35} acenter mt={16} mb={16}>
      <Separator color="backgroundGray800" />
      <ConversionWrapper>
        <Text fs={11} lh={15}>
          {t("addLiquidityModal.conversion.price")}
        </Text>
        <Text fs={11} lh={15} color="primary300">
          {getFormattedNumber(firstValue.amount) + " " + firstValue.currency}
        </Text>
        <Text>=</Text>
        <Text fs={11} lh={15}>
          {getFormattedNumber(secondValue.amount) + " " + secondValue.currency}
        </Text>
      </ConversionWrapper>
    </Box>
  )
}
