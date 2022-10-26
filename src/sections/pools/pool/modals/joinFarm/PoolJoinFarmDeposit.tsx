import { Trans, useTranslation } from "react-i18next"
import { SMaxButton } from "sections/pools/pool/modals/joinFarm/PoolJoinFarm.styled"
import { Text } from "components/Typography/Text/Text"
import { PoolBase } from "@galacticcouncil/sdk"
import { AssetInput } from "components/AssetInput/AssetInput"
import { DualAssetIcons } from "components/DualAssetIcons/DualAssetIcons"
import { Button } from "components/Button/Button"
import { useAccountStore, useStore } from "state/store"
import { useApiPromise } from "utils/network"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { useForm, Controller } from "react-hook-form"
import { FormValues } from "utils/types"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { useActiveYieldFarms, useGlobalFarms } from "api/farms"
import { BN_0, BN_BILL } from "utils/constants"
import { AprFarm } from "utils/farms/apr"
import BigNumber from "bignumber.js"
import { SGridContainer } from "./PoolJoinFarmDeposit.styled"
import BN from "bignumber.js"

type PoolJoinFarmDepositProps = {
  pool: PoolBase
  farm?: AprFarm
  isDrawer?: boolean
}

export const PoolJoinFarmDeposit = (props: PoolJoinFarmDepositProps) => {
  const activeYieldFarms = useActiveYieldFarms(props.pool.address)
  const globalFarms = useGlobalFarms(
    activeYieldFarms.data?.map((f) => f.globalFarmId) ?? [],
  )

  const minDeposit =
    globalFarms.data?.reduce<BigNumber>((memo, i) => {
      const value = i.minDeposit.toBigNumber()
      if (value.isGreaterThan(memo)) return value
      return memo
    }, BN_0) ?? BN_0

  const { t } = useTranslation()
  const { createTransaction } = useStore()
  const api = useApiPromise()

  const shareToken = usePoolShareToken(props.pool.address)
  const [assetIn, assetOut] = props.pool.tokens

  const { account } = useAccountStore()
  const shareTokenBalance = useTokenBalance(
    shareToken.data?.token,
    account?.address,
  )

  const form = useForm<{ value: string }>({})

  async function handleSubmit(data: FormValues<typeof form>) {
    const value = new BN(data.value).times(BN_BILL)
    if (!account) throw new Error("No account found")
    if (props.farm) {
      return await createTransaction({
        tx: api.tx.liquidityMining.depositShares(
          props.farm.globalFarm.id,
          props.farm.yieldFarm.id,
          {
            assetIn: assetIn.id,
            assetOut: assetOut.id,
          },
          value.toString(),
        ),
      })
    }

    if (!activeYieldFarms.data)
      throw new Error("Missing active yield farms data")

    const [firstActive, ...restActive] = activeYieldFarms.data
    const firstDeposit = await createTransaction({
      tx: api.tx.liquidityMining.depositShares(
        firstActive.globalFarmId,
        firstActive.yieldFarmId,
        {
          assetIn: assetIn.id,
          assetOut: assetOut.id,
        },
        value.toString(),
      ),
    })

    for (const record of firstDeposit.events) {
      // currently, liquidityMining.SharesDeposited does not contain the depositId
      // instead, we obtain the value from the nft.InstanceMinted event instead,
      // which should be the same
      if (api.events.nft.InstanceMinted.is(record.event)) {
        const depositId = record.event.data.instanceId

        const txs = restActive.map((item) =>
          api.tx.liquidityMining.redepositLpShares(
            item.globalFarmId,
            item.yieldFarmId,
            { assetIn: assetIn.id, assetOut: assetOut.id },
            depositId,
          ),
        )

        if (txs.length > 1) {
          await createTransaction({ tx: api.tx.utility.batchAll(txs) })
        } else if (txs.length === 1) {
          await createTransaction({ tx: txs[0] })
        }
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <SGridContainer>
        <Text fw={600} lh={22} color="primary200">
          {t("farms.deposit.title")}
        </Text>
        <div sx={{ flex: "row", align: "center", justify: "end" }}>
          <Text fs={12} lh={16} sx={{ mr: 5 }} color="white">
            <Trans
              t={t}
              i18nKey="farms.deposit.balance"
              tOptions={{
                balance: shareTokenBalance.data?.balance ?? "-",
              }}
            >
              <span css={{ opacity: 0.7 }} />
            </Trans>
          </Text>
          <SMaxButton
            size="micro"
            text={t("selectAsset.button.max")}
            capitalize
            onClick={() => {
              const balance = shareTokenBalance.data?.balance

              if (balance != null) {
                form.setValue("value", balance.toString())
              }
            }}
          />
        </div>
        <div sx={{ flex: "row", align: "center" }}>
          <div sx={{ flex: "row", flexShrink: 0, align: "center" }}>
            <DualAssetIcons
              firstIcon={{ icon: getAssetLogo(assetIn.symbol) }}
              secondIcon={{ icon: getAssetLogo(assetOut.symbol) }}
            />
            <div sx={{ flex: "column", mr: 20, flexShrink: 0 }}>
              <Text fw={700} fs={16}>
                {assetIn.symbol}/{assetOut.symbol}
              </Text>
              <Text fw={500} fs={12} color="neutralGray500">
                {t("farms.deposit.assetType")}
              </Text>
            </div>
          </div>

          <Controller
            name="value"
            control={form.control}
            rules={{
              validate: {
                minDeposit: (value) => {
                  return !minDeposit.lte(value)
                    ? t("farms.deposit.error.minDeposit", { minDeposit })
                    : undefined
                },
              },
            }}
            render={({
              field: { value, onChange, name },
              formState: { errors },
            }) => (
              <AssetInput
                name={name}
                label={name}
                value={value}
                css={{ flexGrow: 1 }}
                error={errors.value?.message}
                onChange={onChange}
              />
            )}
          />
        </div>
      </SGridContainer>

      <div
        sx={{
          flex: "row",
          mt: 20,
          justify: "flex-end",
          width: ["100%", "auto"],
        }}
      >
        {account ? (
          <Button type="submit" variant="primary" sx={{ width: "inherit" }}>
            {props.isDrawer ? t("confirm") : t("farms.deposit.submit")}
          </Button>
        ) : (
          <WalletConnectButton />
        )}
      </div>
    </form>
  )
}
