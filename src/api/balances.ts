import { NATIVE_ASSET_ID, useApiPromise } from "utils/api"

import { useAccountStore } from "../state/store"
import BigNumber from "bignumber.js"
import { ApiPromise } from "@polkadot/api"
import { useQueries, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../utils/queryKeys"
import { u32 } from "@polkadot/types"
import { AccountId32 } from "@polkadot/types/interfaces"
import { Maybe, undefinedNoop } from "utils/helpers"

function calculateFreeBalance(
  free: BigNumber,
  miscFrozen: BigNumber,
  feeFrozen: BigNumber,
) {
  const maxFrozenBalance = miscFrozen.gt(feeFrozen) ? miscFrozen : feeFrozen
  return free.minus(maxFrozenBalance)
}

export const getTokenBalance =
  (api: ApiPromise, account: AccountId32 | string, id: string | u32) =>
  async () => {
    if (id.toString() === NATIVE_ASSET_ID) {
      const res = await api.query.system.account(account)
      const freeBalance = new BigNumber(res.data.free.toHex())
      const miscFrozenBalance = new BigNumber(res.data.miscFrozen.toHex())
      const feeFrozenBalance = new BigNumber(res.data.feeFrozen.toHex())
      const balance = new BigNumber(
        calculateFreeBalance(
          freeBalance,
          miscFrozenBalance,
          feeFrozenBalance,
        ) ?? NaN,
      )

      return { accountId: account, assetId: id, balance }
    }

    const res = (await api.query.tokens.accounts(account, id)) as any

    const freeBalance = new BigNumber(res.free.toHex())
    const reservedBalance = new BigNumber(res.reserved.toHex())
    const frozenBalance = new BigNumber(res.frozen.toHex())
    const balance = new BigNumber(
      calculateFreeBalance(freeBalance, reservedBalance, frozenBalance) ?? NaN,
    )

    return { accountId: account, assetId: id, balance }
  }

export const useTokenBalance = (
  id: Maybe<string | u32>,
  address: Maybe<AccountId32 | string>,
) => {
  const api = useApiPromise()
  const { account } = useAccountStore()
  const finalAddress = address ?? account?.address

  return useQuery(
    QUERY_KEYS.tokenBalance(id, finalAddress),
    finalAddress != null && id != null
      ? getTokenBalance(api, finalAddress, id)
      : undefinedNoop,
    { enabled: finalAddress != null && id != null },
  )
}

export function useTokensBalances(tokenIds: (string | u32)[]) {
  const { account } = useAccountStore()
  const api = useApiPromise()

  const queries = useQueries({
    queries: tokenIds.map((id) => ({
      queryKey: QUERY_KEYS.tokenBalance(id),
      queryFn: () => getTokenBalance(api, account?.address ?? "", id)(),
      enabled: !!account,
    })),
  })

  return queries.map((balance) => balance.data)
}
