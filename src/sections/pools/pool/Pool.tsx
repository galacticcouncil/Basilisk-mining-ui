import { FC, useState } from "react"
import { PoolActions } from "sections/pools/pool/actions/PoolActions"
import { PoolIncentives } from "sections/pools/pool/incentives/PoolIncentives"
import { SContainer } from "sections/pools/pool/Pool.styled"
import { Box } from "components/Box/Box"
import { PoolDetails } from "sections/pools/pool/details/PoolDetails"
import { PoolBase } from "@galacticcouncil/sdk"
import { PoolShares } from "sections/pools/pool/shares/PoolShares"
import { AnimatePresence, motion } from "framer-motion"

type Props = { pool: PoolBase }

export const Pool: FC<Props> = ({ pool }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <SContainer>
      <Box flex spread p="24px" gap={10}>
        <PoolDetails pool={pool} />
        <PoolIncentives poolId={pool.address} />
        <PoolActions
          pool={pool}
          isExpanded={isExpanded}
          onExpandClick={() => setIsExpanded((prev) => !prev)}
        />
      </Box>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <PoolShares pool={pool} />
          </motion.div>
        )}
      </AnimatePresence>
    </SContainer>
  )
}
