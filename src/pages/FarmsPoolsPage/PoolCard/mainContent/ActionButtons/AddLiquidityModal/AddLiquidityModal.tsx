import { BasiliskIcon } from "assets/icons/tokens/BasiliskIcon"
import { SakuraIcon } from "assets/icons/tokens/SakuraIcon"
import { Button } from "components/Button/Button"
import { Modal } from "components/Modal/Modal"
import { Row } from "components/Row/Row"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { Conversion } from "./Conversion/Conversion"
import { SelectAsset } from "./SelectAsset/SelectAsset"

type AddLiquidityModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const AddLiquidityModal: FC<AddLiquidityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation()
  const [asset1, setAsset1] = useState("4523")
  const [asset2, setAsset2] = useState("1234")

  return (
    <Modal
      open={isOpen}
      title={t("farmsPoolsPage.addLiquidity.modal.title")}
      onClose={onClose}
    >
      <SelectAsset
        balance={123456789.124}
        usd={2456}
        mt={16}
        currency={{ short: "SAK", full: "Sakura" }}
        assetIcon={<SakuraIcon />}
        value={asset1}
        onChange={setAsset1}
      />
      <Conversion
        firstValue={{ amount: 1, currency: "SAK" }}
        secondValue={{ amount: 0.000123, currency: "BSX" }}
      />
      <SelectAsset
        balance={123456789}
        usd={2456}
        currency={{ short: "BSX", full: "Basilisk" }}
        assetIcon={<BasiliskIcon />}
        value={asset2}
        onChange={setAsset2}
      />

      <Row left={t("farmsPoolsPage.addLiquidity.modal.row.apr")} right="5%" />
      <Separator />
      <Row
        left={t("farmsPoolsPage.addLiquidity.modal.row.transactionCost")}
        right={
          <>
            <Text mr={4}>≈ 12 BSX</Text>
            <Text color="primary400">(2%)</Text>
          </>
        }
      />
      <Separator />
      <Row
        left={t("farmsPoolsPage.addLiquidity.modal.row.sharePool")}
        right="5%"
      />
      <Separator />
      {/*TODO add tooltip component afterwards */}
      <Row
        left={t("farmsPoolsPage.addLiquidity.modal.row.shareTokens")}
        right={<Text color="primary400">3000</Text>}
      />
      <Button
        text={t("farmsPoolsPage.addLiquidity.modal.confirmButton")}
        variant="primary"
        fullWidth
        mt={30}
      />
    </Modal>
  )
}