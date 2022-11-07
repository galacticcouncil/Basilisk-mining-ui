import { useAUSD } from "api/asset"
import { useMemo } from "react"
import BN from "bignumber.js"
import { useAssetMetaList } from "api/assetMeta"
import { useAccountStore } from "state/store"
import { useAccountBalances } from "api/accountBalances"
import { useSpotPrices } from "api/spotPrice"
import { NATIVE_ASSET_ID } from "utils/api"
import { BN_0, BN_10 } from "utils/constants"
import { AssetsTableData } from "sections/wallet/assets/table/WalletAssetsTable.utils"
import { PalletBalancesAccountData } from "@polkadot/types/lookup"
import { u32 } from "@polkadot/types"
import { useAssetDetailsList } from "api/assetDetails"
import { getAssetName } from "components/AssetIcon/AssetIcon"

export const useAssetsTableData = () => {
  const { account } = useAccountStore()
  const accountBalances = useAccountBalances(account?.address)
  const tokenIds = accountBalances.data?.balances
    ? [NATIVE_ASSET_ID, ...accountBalances.data.balances.map((b) => b.id)]
    : []
  const balances = useAssetsBalances()
  const assetDetails = useAssetDetailsList(tokenIds)
  const assets = assetDetails.filter((ad) => ad.data?.assetType === "Token")

  const queries = [...assetDetails, balances]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (assetDetails.some((q) => !q.data) || !balances.data) return []

    const res = assets.map((asset) => {
      const balance = balances.data?.find(
        (b) => b.id.toString() === asset.data?.id.toString(),
      )

      if (!balance) return null

      return {
        symbol: asset.data?.name,
        name: getAssetName(asset.data?.name),
        transferable: balance?.transferable ?? BN_0,
        transferableUSD: balance?.transferableUSD ?? BN_0,
        total: balance?.total ?? BN_0,
        totalUSD: balance?.totalUSD ?? BN_0,
        locked: new BN(999999999),
        lockedUSD: new BN(999999999),
        origin: "TODO",
      }
    })

    return res.filter((x): x is AssetsTableData => x !== null)
  }, [assets, balances.data])

  return { data, isLoading }
}

const useAssetsBalances = () => {
  const { account } = useAccountStore()
  const accountBalances = useAccountBalances(account?.address)
  const tokenIds = accountBalances.data?.balances
    ? [NATIVE_ASSET_ID, ...accountBalances.data.balances.map((b) => b.id)]
    : []
  const assetMetas = useAssetMetaList(tokenIds)
  const aUSD = useAUSD()
  const spotPrices = useSpotPrices(tokenIds, aUSD.data?.id)

  const queries = [accountBalances, ...assetMetas, aUSD, ...spotPrices]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (
      !accountBalances.data ||
      assetMetas.some((q) => !q.data) ||
      spotPrices.some((q) => !q.data)
    )
      return undefined

    const tokens: (AssetsTableDataBalances | null)[] =
      accountBalances.data.balances.map((ab) => {
        const id = ab.id
        const spotPrice = spotPrices.find((sp) => id.eq(sp.data?.tokenIn))
        const meta = assetMetas.find((am) => id.eq(am.data?.id))

        if (!spotPrice?.data || !meta?.data?.data) return null

        const dp = BN_10.pow(meta.data.data.decimals.toBigNumber())
        const free = ab.data.free.toBigNumber()
        const reserved = ab.data.reserved.toBigNumber()
        const frozen = ab.data.frozen.toBigNumber()

        const total = free.plus(reserved).div(dp)
        const totalUSD = total.times(spotPrice.data.spotPrice)
        const transferable = free.minus(frozen).div(dp)
        const transferableUSD = transferable.times(spotPrice.data.spotPrice)

        return { id, total, totalUSD, transferable, transferableUSD }
      })

    const nativeBalance = accountBalances.data.native.data
    const nativeDecimals = assetMetas
      .find((am) => am.data?.id === NATIVE_ASSET_ID)
      ?.data?.data?.decimals.toBigNumber()
    const nativeSpotPrice = spotPrices.find(
      (sp) => sp.data?.tokenIn === NATIVE_ASSET_ID,
    )?.data?.spotPrice
    const native = getNativeBalances(
      nativeBalance,
      nativeDecimals,
      nativeSpotPrice,
    )

    return [native, ...tokens].filter(
      (x): x is AssetsTableDataBalances => x !== null,
    )
  }, [accountBalances.data, assetMetas, spotPrices])

  return { data, isLoading }
}

export const getNativeBalances = (
  balance: PalletBalancesAccountData,
  decimals?: BN,
  spotPrice?: BN,
): AssetsTableDataBalances | null => {
  if (!decimals || !spotPrice) return null

  const dp = BN_10.pow(decimals)
  const free = balance.free.toBigNumber()
  const reserved = balance.reserved.toBigNumber()
  const feeFrozen = balance.feeFrozen.toBigNumber()
  const miscFrozen = balance.miscFrozen.toBigNumber()

  const total = free.plus(reserved).div(dp)
  const totalUSD = total.times(spotPrice)
  const transferable = free.minus(BN.max(feeFrozen, miscFrozen)).div(dp)
  const transferableUSD = transferable.times(spotPrice)

  return {
    id: NATIVE_ASSET_ID,
    total,
    totalUSD,
    transferable,
    transferableUSD,
  }
}

type AssetsTableDataBalances = {
  id: string | u32
  total: BN
  totalUSD: BN
  transferable: BN
  transferableUSD: BN
}
