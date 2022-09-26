import { FC, useMemo } from "react"
import { Box } from "components/Box/Box"
import { Text } from "components/Typography/Text/Text"
import { PoolPositionFarm } from "sections/pools/pool/position/farm/PoolPositionFarm"
import { useTranslation } from "react-i18next"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"
import { AccountId32 } from "@polkadot/types/interfaces"
import { SContainer } from "sections/pools/pool/position/PoolPosition.styled"
import { useGlobalFarm } from "api/farms"

type Props = {
  position: PalletLiquidityMiningYieldFarmEntry
  index: number
  poolId: AccountId32
}

export const PoolPosition: FC<Props> = ({ position, index, poolId }) => {
  const { t } = useTranslation()
  const globalFarm = useGlobalFarm(position.globalFarmId)

  const enteredDate = useMemo(() => {
    if (!globalFarm.data) return "-"

    const enteredAt = position.enteredAt.toBigNumber()
    const blocksPerPeriod = globalFarm.data.blocksPerPeriod.toBigNumber()
    const blockRange = enteredAt
      .times(blocksPerPeriod)
      .plus(blocksPerPeriod.plus(1))

    return blockRange.toFixed()
  }, [globalFarm.data, position.enteredAt])

  return (
    <SContainer key={index}>
      <Box flex column gap={6}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.position.title", { index })}
        </Text>
        <Text fs={14} lh={18} color="white">
          {t("pools.pool.positions.position.entered", {
            date: enteredDate, // TODO: get a date from this
          })}
        </Text>
      </Box>
      <Box flex column gap={6}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.position.locked")}
        </Text>
        <Text fs={14} lh={18} color="white">
          {t("pools.pool.positions.position.shares", {
            shares: position.valuedShares.toBigNumber(), // TODO: probably not the correct number
          })}
        </Text>
      </Box>
      <Box flex column gap={6}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.position.current")}
        </Text>
        <Box flex column gap={2}>
          <Text fs={14} lh={18} color="white">
            TODO
          </Text>
          <Text fs={12} lh={16} color="neutralGray500">
            TODO
          </Text>
        </Box>
      </Box>
      <PoolPositionFarm
        poolId={poolId}
        globalFarmId={position.globalFarmId}
        yieldFarmId={position.yieldFarmId}
      />
    </SContainer>
  )
}
