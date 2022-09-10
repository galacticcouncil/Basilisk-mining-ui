import { FC } from "react"
import { PoolActions } from "sections/pools/pool/actions/PoolActions"
import { PoolIncentives } from "sections/pools/pool/incentives/PoolIncentives"
import { SContainer } from "sections/pools/pool/Pool.styled"
import { PoolClaim } from "sections/pools/pool/claim/PoolClaim"
import { Box } from "components/Box/Box"
import { PoolDetails } from "sections/pools/pool/details/PoolDetails"
import { PoolShares } from "sections/pools/pool/shares/PoolShares"
import { usePoolData } from "sections/pools/pool/Pool.utils"
import { BN_0, TRADING_FEE } from "utils/constants"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { u32 } from "@polkadot/types"

export interface PoolConfig {
  id: AccountId32
  assetA: u32
  assetB: u32
  hasJoinedFarms?: boolean
  hasLiquidity?: boolean
}

export const Pool: FC<PoolConfig> = (props) => {
  const pool = usePoolData(props)

  return (
    <SContainer>
      <Box flex spread p="24px 24px 0" gap={10}>
        <PoolDetails
          assetAName={pool.data?.assetA.details?.name ?? "?"}
          assetBName={pool.data?.assetB.details?.name ?? "?"}
          totalValue={pool.data?.totalValue ?? BN_0}
          tradingFee={pool.data?.tradingFee ?? TRADING_FEE}
        />
        <PoolIncentives id={props.id} />
        <PoolActions {...props} />
      </Box>
      {props.hasLiquidity && <PoolShares />}
      {props.hasJoinedFarms && <PoolClaim />}
    </SContainer>
  )
}