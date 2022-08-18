import { ChevronDown } from "assets/icons/ChevronDown"
import { MinusIcon } from "assets/icons/MinusIcon"
import { PlusIcon } from "assets/icons/PlusIcon"
import { WindMillIcon } from "assets/icons/WindMillIcon"
import { Box } from "components/Box/Box"
import { Button } from "components/Button/Button"
import { Icon } from "components/Icon/Icon"
import { IconButton } from "components/IconButton/IconButton"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { AddLiquidityModal } from "./AddLiquidityModal/AddLiquidityModal"
import { RemoveLiquidityModal } from "pages/FarmsPoolsPage/RemoveLiquidityModal/RemoveLiquidityModal"
import { AllFarmsModal } from "pages/FarmsPoolsPage/AllFarmsModal/AllFarmsModal"

type ActionButtonProps = {
  hasJoinedFarms: boolean
  closeCard: (val: boolean) => void
}

export const ActionButtons: FC<ActionButtonProps> = ({
  hasJoinedFarms,
  closeCard,
}) => {
  const { t } = useTranslation()

  const [openAdd, setOpenAdd] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [openFarms, setOpenFarms] = useState(false)

  return (
    <>
      <Box flex spread acenter m="26px 0 48px" width={280}>
        <Box width={214} flex column gap={10} mr={hasJoinedFarms ? 33 : 67}>
          <Button fullWidth size="small" onClick={() => setOpenAdd(true)}>
            <Box flex acenter jcenter>
              <Icon icon={<PlusIcon />} mr={11} />
              {t("farmsPoolsPage.poolCard.actionButtons.addLiquidity")}
            </Box>
          </Button>

          <Button fullWidth size="small" onClick={() => setOpenRemove(true)}>
            <Box flex acenter jcenter>
              <Icon icon={<MinusIcon />} mr={11} />
              {t("farmsPoolsPage.poolCard.actionButtons.removeLiquidity")}
            </Box>
          </Button>

          <Button fullWidth size="small" onClick={() => setOpenFarms(true)}>
            <Box flex acenter jcenter>
              <Icon icon={<WindMillIcon />} mr={11} />
              {t("farmsPoolsPage.poolCard.actionButtons.joinFarm")}
            </Box>
          </Button>
        </Box>
        {hasJoinedFarms && (
          <IconButton
            icon={<ChevronDown />}
            width={6}
            height={3}
            name={t("farmsPoolsPage.poolCard.actionButtons.chevron.name")}
          />
        )}
      </Box>
      <AddLiquidityModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
      <RemoveLiquidityModal
        isOpen={openRemove}
        onClose={() => setOpenRemove(false)}
      />
      <AllFarmsModal isOpen={openFarms} onClose={() => setOpenFarms(false)} />
    </>
  )
}
