import { Modal } from "components/Modal/Modal"
import { useAPR, useLoyaltyFactor } from "utils/apr"
import { u32 } from "@polkadot/types"
import { PoolBase } from "@galacticcouncil/sdk"
import { useState } from "react"
import { PoolJoinFarmSectionList } from "./PoolJoinFarmSectionList"
import { PoolJoinFarmSectionDetail } from "./PoolJoinFarmSectionDetail"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"

export const PoolJoinFarm = (props: {
  pool: PoolBase
  isOpen: boolean
  onClose: () => void
  onSelect: () => void
}) => {
  const apr = useAPR(props.pool.address)

  const loyaltyFactors = useLoyaltyFactor(props.pool.address)
  const [selectedYieldFarmId, setSelectedYieldFarmId] = useState<{
    globalFarmId: u32
    yieldFarmId: u32
    yieldFarmEntry?: PalletLiquidityMiningYieldFarmEntry
  } | null>(null)

  const selectedFarm = selectedYieldFarmId
    ? apr.data.find(
        (i) =>
          i.yieldFarm.id.eq(selectedYieldFarmId.yieldFarmId) &&
          i.globalFarm.id.eq(selectedYieldFarmId.globalFarmId),
      )
    : null

  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <div sx={{ flex: "column", gap: 8, mt: 24 }}>
        {selectedFarm != null ? (
          <PoolJoinFarmSectionDetail
            pool={props.pool}
            farm={selectedFarm}
            position={selectedYieldFarmId?.yieldFarmEntry}
            onBack={() => setSelectedYieldFarmId(null)}
          />
        ) : (
          <PoolJoinFarmSectionList
            pool={props.pool}
            onSelect={setSelectedYieldFarmId}
          />
        )}
      </div>
      <div css={{ height: 300, width: "100%" }}>
        <Graph labelX="Periods" labelY="Loyalty Rate" data={data} />
      </div>
    </Modal>
  )
}
