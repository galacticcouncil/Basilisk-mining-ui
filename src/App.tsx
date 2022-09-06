import { ApiPromise, WsProvider } from "@polkadot/api"
import { useQuery } from "@tanstack/react-query"
import { LoadingPage } from "sections/loading/LoadingPage"
import { ApiPromiseContext } from "utils/network"
import { PoolsPage } from "sections/pools/PoolsPage"
import * as definitions from "./interfaces/voting/definitions"
import { Transactions } from "./sections/transaction/Transactions"

export const App = () => {
  const api = useQuery(
    ["provider", "wss://rpc-01.basilisk-rococo.hydradx.io"],
    async ({ queryKey: [_, api] }) => {
      const provider = new WsProvider(api)
      const types = Object.values(definitions).reduce(
        (res, { types }): object => ({ ...res, ...types }),
        {},
      )
      return await ApiPromise.create({ provider, types })
    },
    { staleTime: Infinity },
  )

  return api.data ? (
    <ApiPromiseContext.Provider value={api.data}>
      <PoolsPage />
      <Transactions />
    </ApiPromiseContext.Provider>
  ) : (
    <LoadingPage />
  )
}
