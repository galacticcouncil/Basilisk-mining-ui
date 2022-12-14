import { Trans, useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { Text } from "components/Typography/Text/Text"
import { Button } from "components/Button/Button"
import { css } from "@emotion/react"
import { theme } from "theme"
import { SContainer } from "./PoolFarmClaim.styled"
import { PoolBase } from "@galacticcouncil/sdk"
import { useClaimableAmount, useClaimAllMutation } from "utils/farms/claiming"
import { Modal } from "components/Modal/Modal"
import { ReactComponent as WalletIcon } from "assets/icons/Wallet.svg"
import { PoolPositionMobile } from "sections/pools/farm/position/PoolFarmPositionMobile"
import { useUserDeposits } from "utils/farms/deposits"
import { separateBalance } from "utils/balance"
import { DepositNftType } from "api/deposits"

export function PoolFarmClaim(props: {
  pool: PoolBase
  depositNft?: DepositNftType
}) {
  const { t } = useTranslation()
  const [openMyPositions, setOpenMyPositions] = useState(false)

  const positions = useUserDeposits(props.pool.address)
  const claimable = useClaimableAmount(props.pool, props.depositNft)
  const claimAll = useClaimAllMutation(props.pool.address, props.depositNft)

  const balance = separateBalance(claimable.data?.bsx, {
    fixedPointScale: 12,
    numberPrefix: "≈",
    type: "token",
  })

  const positionsList = useMemo(() => {
    let index = 0

    return positions.data?.map((deposit) =>
      deposit.deposit.yieldFarmEntries.map((entry) => {
        ++index
        return (
          <PoolPositionMobile
            key={index}
            pool={props.pool}
            position={entry}
            index={index}
          />
        )
      }),
    )
  }, [positions.data, props.pool])

  return (
    <SContainer>
      <div css={{ flexShrink: 1 }}>
        <Text color="primary200" fs={16} sx={{ mb: 6 }}>
          {t("pools.allFarms.modal.claim.title")}
        </Text>
        <Text
          fw={900}
          sx={{ mb: 4, fontSize: [24, 28] }}
          css={{ wordBreak: "break-all" }}
        >
          <Trans
            t={t}
            i18nKey={
              !claimable.data?.bsx.isNaN()
                ? "pools.allFarms.modal.claim.bsx"
                : "pools.allFarms.modal.claim.bsx.nan"
            }
            tOptions={balance ?? {}}
          >
            <span
              css={css`
                color: rgba(${theme.rgbColors.white}, 0.4);
                font-size: 18px;
              `}
            />
          </Trans>
        </Text>
        <Text
          css={css`
            color: rgba(255, 255, 255, 0.4);
            word-break: break-all;
          `}
        >
          {t("value.usd", { amount: claimable.data?.usd, fixedPointScale: 12 })}
        </Text>
      </div>
      <div
        sx={{
          flex: "row",
          justify: "space-between",
        }}
      >
        {positions.data && positions.data.length > 0 ? (
          <Button
            variant="secondary"
            sx={{
              p: "10px 16px",
              display: ["inherit", "none"],
            }}
            disabled={!positions.data?.length}
            isLoading={claimAll.mutation.isLoading}
            onClick={() => setOpenMyPositions(true)}
          >
            <WalletIcon />
            {t("pools.allFarms.modal.myPositions")}
          </Button>
        ) : (
          <span />
        )}
        <Button
          variant="primary"
          sx={{
            ml: [0, 32],
            flexShrink: 0,
            p: ["10px 16px", "16px 36px"],
            width: "max-content",
          }}
          disabled={!!claimable.data?.bsx.isZero()}
          isLoading={claimAll.mutation.isLoading}
          onClick={() => claimAll.mutation.mutate()}
        >
          {t("pools.allFarms.modal.claim.submit")}
        </Button>
      </div>
      <Modal
        open={openMyPositions}
        isDrawer
        titleDrawer={t("pools.allFarms.modal.list.positions")}
        onClose={() => setOpenMyPositions(false)}
      >
        <div sx={{ flex: "column", gap: 10 }}>{positionsList}</div>
      </Modal>
    </SContainer>
  )
}
