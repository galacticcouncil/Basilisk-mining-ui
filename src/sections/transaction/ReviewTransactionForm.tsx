import { useTranslation } from "react-i18next"
import { Text } from "components/Typography/Text/Text"
import { Box } from "components/Box/Box"
import { SDetailRow } from "./ReviewTransaction.styled"
import { Button } from "components/Button/Button"
import { TransactionCode } from "components/TransactionCode/TransactionCode"
import { Transaction, useStore } from "../../state/store"
import { getTransactionJSON } from "./ReviewTransaction.utils"
import { usePaymentInfo } from "../../api/transaction"
import BigNumber from "bignumber.js"
import { web3FromAddress } from "@polkadot/extension-dapp"
import { useMutation } from "@tanstack/react-query"
import { SubmittableExtrinsic } from "@polkadot/api/types"

export const ReviewTransactionForm = (
  props: {
    title?: string
    onCancel: () => void
    onSigned: (signed: SubmittableExtrinsic<"promise">) => void
  } & Transaction,
) => {
  const { t } = useTranslation()
  const { account } = useStore()

  const signTx = useMutation(async () => {
    const address = account?.address?.toString()
    if (address == null) throw new Error("Missing active account")

    const injector = await web3FromAddress(address)

    const signature = await props.tx.signAsync(address, {
      signer: injector.signer,
    })
    return await props.onSigned(signature)
  })

  const json = getTransactionJSON(props.tx)
  const { data: paymentInfoData } = usePaymentInfo(props.tx)

  return (
    <>
      {props.title && (
        <Text color="neutralGray400" fw={400} mt={6}>
          {props.title}
        </Text>
      )}
      <Box mt={16}>
        <TransactionCode name={`Method ${json.name}`} src={json.code} />
      </Box>
      <Box mt={10}>
        <SDetailRow>
          <Text color="neutralGray300">
            {t("pools.reviewTransaction.modal.detail.cost")}
          </Text>
          <Box flex column align="end">
            {paymentInfoData && (
              <>
                <Text color="white">
                  {t("pools.addLiquidity.modal.row.transactionCostValue", {
                    amount: {
                      value: new BigNumber(paymentInfoData.partialFee.toHex()),
                      displayDecimals: 2,
                    },
                  })}
                </Text>
                <Text color="primary400" fs={12}>
                  2%
                </Text>
              </>
            )}
          </Box>
        </SDetailRow>
        <SDetailRow>
          <Text color="neutralGray300">
            {t("pools.reviewTransaction.modal.detail.lifetime")}
          </Text>
          <Text color="white">12/10/2022, 10:00:00</Text>
        </SDetailRow>
        <SDetailRow>
          <Text color="neutralGray300">
            {t("pools.reviewTransaction.modal.detail.tip")}
          </Text>
          <Text color="white">0.0066 BSX</Text>
        </SDetailRow>
        <SDetailRow>
          <Text color="neutralGray300">
            {t("pools.reviewTransaction.modal.detail.nonce")}
          </Text>
          <Text color="white">0</Text>
        </SDetailRow>
      </Box>
      <Box mt={24} flex spread>
        <Button
          onClick={props.onCancel}
          text={t("pools.reviewTransaction.modal.cancel")}
          variant="secondary"
        />
        <Button
          text={t("pools.reviewTransaction.modal.confirmButton")}
          variant="primary"
          isLoading={signTx.isLoading}
          disabled={account == null}
          onClick={() => signTx.mutate()}
        />
      </Box>
    </>
  )
}
