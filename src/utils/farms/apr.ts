import BN from "bignumber.js"
import { useActiveYieldFarms, useGlobalFarms, useYieldFarms } from "api/farms"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { BLOCK_TIME, BN_QUINTILL } from "utils/constants"
import { secondsInYear } from "date-fns"
import { useBestNumber } from "api/chain"
import { useQueryReduce } from "utils/helpers"
import {
  PalletLiquidityMiningGlobalFarmData,
  PalletLiquidityMiningYieldFarmData,
} from "@polkadot/types/lookup"

export type PoolFarm = NonNullable<
  Exclude<ReturnType<typeof usePoolFarms>["data"], undefined>[number]
>
export const usePoolFarms = (poolId: AccountId32 | string) => {
  const activeYieldFarms = useActiveYieldFarms(poolId)
  const globalFarms = useGlobalFarms(
    activeYieldFarms.data?.map((f) => f.globalFarmId) ?? [],
  )
  const yieldFarms = useYieldFarms(activeYieldFarms.data ?? [])

  return useQueryReduce(
    [activeYieldFarms, globalFarms, yieldFarms] as const,
    (activeYieldFarms, globalFarms, yieldFarms) => {
      const farms = activeYieldFarms.map((af) => {
        const globalFarm = globalFarms.find((gf) => af.globalFarmId.eq(gf.id))
        const yieldFarm = yieldFarms.find((yf) => af.yieldFarmId.eq(yf.id))
        if (!globalFarm || !yieldFarm) return undefined
        return { globalFarm, yieldFarm }
      })

      return farms.filter(
        (
          x,
        ): x is {
          globalFarm: PalletLiquidityMiningGlobalFarmData
          yieldFarm: PalletLiquidityMiningYieldFarmData
        } => x != null,
      )
    },
  )
}

export type AprFarm = NonNullable<
  Exclude<ReturnType<typeof useAPR>["data"], undefined>[number]
>

export const useAPR = (poolId: AccountId32 | string) => {
  const bestNumber = useBestNumber()
  const poolFarms = usePoolFarms(poolId)

  return useQueryReduce(
    [bestNumber, poolFarms] as const,
    (bestNumber, poolFarms) => {
      const data = poolFarms.map((farm) => {
        const { globalFarm, yieldFarm } = farm

        const totalSharesZ = globalFarm.totalSharesZ.toBigNumber()
        const plannedYieldingPeriods =
          globalFarm.plannedYieldingPeriods.toBigNumber()
        const yieldPerPeriod = globalFarm.yieldPerPeriod
          .toBigNumber()
          .div(BN_QUINTILL) // 18dp
        const maxRewardPerPeriod = globalFarm.maxRewardPerPeriod.toBigNumber()
        const blocksPerPeriod = globalFarm.blocksPerPeriod.toBigNumber()
        const currentPeriod = bestNumber.relaychainBlockNumber
          .toBigNumber()
          .dividedToIntegerBy(blocksPerPeriod)
        const blockTime = BLOCK_TIME
        const multiplier = yieldFarm.multiplier.toBigNumber().div(BN_QUINTILL)
        const secondsPerYear = new BN(secondsInYear)
        const periodsPerYear = secondsPerYear.div(
          blockTime.times(blocksPerPeriod),
        )

        let apr
        if (totalSharesZ.isZero()) {
          apr = yieldPerPeriod.times(multiplier).times(periodsPerYear)
        } else {
          const globalRewardPerPeriod = getGlobalRewardPerPeriod(
            totalSharesZ,
            yieldPerPeriod,
            maxRewardPerPeriod,
          )
          const poolYieldPerPeriod = getPoolYieldPerPeriod(
            globalRewardPerPeriod,
            multiplier,
            totalSharesZ,
          )
          apr = poolYieldPerPeriod.times(periodsPerYear)
        }

        // multiply by 100 since APR should be a percentage
        apr = apr.times(100)

        // all of the APR calculations are using only half of the position -
        // this is correct in terms of inputs but for the user,
        // they are not depositing only half of the position, they are depositing 2 assets
        apr = apr.div(2)

        // max distribution of rewards
        // https://www.notion.so/Screen-elements-mapping-Farms-baee6acc456542ca8d2cccd1cc1548ae?p=4a2f16a9f2454095945dbd9ce0eb1b6b&pm=s
        const distributedRewards = globalFarm.pendingRewards
          .toBigNumber()
          .plus(globalFarm.accumulatedPaidRewards.toBigNumber())

        const maxRewards = maxRewardPerPeriod.times(plannedYieldingPeriods)
        const leftToDistribute = maxRewards.minus(distributedRewards)

        // estimate, when the farm will most likely distribute all the rewards
        const updatedAtPeriod = globalFarm.updatedAt.toBigNumber()
        const periodsLeft = leftToDistribute.div(maxRewardPerPeriod)

        // if there are no deposits, the farm is not running and distributing rewards
        const estimatedEndPeriod = totalSharesZ.gte(0)
          ? updatedAtPeriod.plus(periodsLeft)
          : currentPeriod.plus(periodsLeft)

        const estimatedEndBlock = estimatedEndPeriod.times(blocksPerPeriod)

        // fullness of the farm
        // interpreted as how close are we to the cap of yield per period
        // https://www.notion.so/FAQ-59697ce6fd2e46e1b8f9093ba4606e88#446ee616be484c5e86e5eb82d3a29455
        const fullness = totalSharesZ
          .times(yieldPerPeriod)
          .div(maxRewardPerPeriod)

        return {
          apr,
          distributedRewards,
          maxRewards,
          fullness,
          estimatedEndBlock: estimatedEndBlock,
          assetId: globalFarm.rewardCurrency,
          ...farm,
        }
      })

      return data.filter((x): x is NonNullable<typeof data[number]> => !!x)
    },
  )
}

export const getGlobalRewardPerPeriod = (
  totalSharesZ: BN,
  yieldPerPeriod: BN,
  maxRewardPerPeriod: BN,
) => {
  const globalRewardPerPeriod = totalSharesZ.times(yieldPerPeriod)
  const isFarmFull = globalRewardPerPeriod.gte(maxRewardPerPeriod)

  return isFarmFull ? maxRewardPerPeriod : globalRewardPerPeriod
}

export const getPoolYieldPerPeriod = (
  globalRewardPerPeriod: BN,
  multiplier: BN,
  totalSharesZ: BN,
) => {
  return globalRewardPerPeriod.times(multiplier).div(totalSharesZ)
}

export const getMinAndMaxAPR = (aprFarms: AprFarm[]) => {
  const aprs = aprFarms.map((aprFarm) => aprFarm.apr)
  const minApr = BN.minimum(...aprs)
  const maxApr = BN.maximum(...aprs)
  return { minApr, maxApr }
}
