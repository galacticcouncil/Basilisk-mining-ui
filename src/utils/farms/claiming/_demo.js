console.log(
  await Promise.all([
    api.query.xykWarehouseLM.globalFarm(10),
    api.query.xykWarehouseLM.globalFarm(12),
    api.query.xykWarehouseLM.yieldFarm(
      "bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY",
      10,
      14,
    ),
    api.query.xykWarehouseLM.yieldFarm(
      "bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY",
      12,
      15,
    ),
    api.query.system.account(
      "5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis",
    ),
    api.query.system.account(
      "5EYCAe5diR59yJu1zi8T3ryPavxifKcASoLjHJP1V4qM3zvk",
    ),
    api.query.tokens.accounts(
      "5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis",
      4,
    ),
    api.query.tokens.accounts(
      "5EYCAe5diR59yJu1zi8zXv4ZovK7aRouv9DkPBkgQiaob13o",
      4,
    ),
    api.query.xykWarehouseLM.deposit(5),
  ]),
)

// "5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis" 0 (pot)
// "5EYCAe5diR59yJu1zi8T3ryPavxifKcASoLjHJP1V4qM3zvk" 0 (global farm)
// "5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis" 4 (pot)
// "5EYCAe5diR59yJu1zi8zXv4ZovK7aRouv9DkPBkgQiaob13o" 4 (global farm)

const result = [
  {
    id: 10,
    owner: "bXhmisFH9dL7obCbbNLXqZbsGvANArBQWeFSrJ2ZMQ3uK3tXg",
    updatedAt: 1560649,
    totalSharesZ: "0x0000000000000015bfc66805b7497cb0",
    accumulatedRpz: "0x0000000000000000001e209208975110",
    rewardCurrency: 0,
    accumulatedRewards: 3075389218210,
    paidAccumulatedRewards: "0x000000000000000000a97b9ce8510501",
    yieldPerPeriod: 304414003044,
    plannedYieldingPeriods: 151200,
    blocksPerPeriod: 2,
    incentivizedAsset: 0,
    maxRewardPerPeriod: 760582010582010,
    minDeposit: 1000,
    liveYieldFarmsCount: 2,
    totalYieldFarmsCount: 2,
    priceAdjustment: "0x00000000000000000de0b6b3a7640000",
    state: "Active",
  },
  {
    id: 12,
    owner: "bXhmisFH9dL7obCbbNLXqZbsGvANArBQWeFSrJ2ZMQ3uK3tXg",
    updatedAt: 1560635,
    totalSharesZ: 2134366411045150,
    accumulatedRpz: "0x00000000000000000019f61f44eb77c9",
    rewardCurrency: 4,
    accumulatedRewards: 15533733441408,
    paidAccumulatedRewards: 6226268888,
    yieldPerPeriod: 262557077625,
    plannedYieldingPeriods: 151200,
    blocksPerPeriod: 2,
    incentivizedAsset: 4,
    maxRewardPerPeriod: 59523809523,
    minDeposit: 1000,
    liveYieldFarmsCount: 2,
    totalYieldFarmsCount: 2,
    priceAdjustment: "0x00000000000000000de0b6b3a7640000",
    state: "Active",
  },
  {
    id: 14,
    updatedAt: 1560633,
    totalShares: "0x000000000000000006de55f7818e8cc1",
    totalValuedShares: "0x000000000000000008c33d5e7e6228fd",
    accumulatedRpvs: "0x0000000000000000001e1c2400c65aa8",
    accumulatedRpz: "0x0000000000000000001e1c2400c65ad1",
    loyaltyCurve: {
      initialRewardPercentage: "0x000000000000000006f05b59d3b20000",
      scaleCoef: 50000,
    },
    multiplier: "0x00000000000000000de0b6b3a7640000",
    state: "Active",
    entriesCount: 3,
    leftToDistribute: 360825852820805,
  },
  {
    id: 15,
    updatedAt: 1560635,
    totalShares: "0x000000000000000006dac878dcc80cc1",
    totalValuedShares: 8638361715185,
    accumulatedRpvs: "0x00000000000000000019f61f44df5fe7",
    accumulatedRpz: "0x00000000000000000019f61f44eb77c9",
    loyaltyCurve: {
      initialRewardPercentage: "0x000000000000000006f05b59d3b20000",
      scaleCoef: 50000,
    },
    multiplier: "0x00000000000000000de0b6b3a7640000",
    state: "Active",
    entriesCount: 2,
    leftToDistribute: 6226268888,
  },
  {
    nonce: 0,
    consumers: 0,
    providers: 3,
    sufficients: 0,
    data: { free: 45648785307383066, reserved: 0, miscFrozen: 0, feeFrozen: 0 },
  },
  {
    nonce: 0,
    consumers: 0,
    providers: 1,
    sufficients: 0,
    data: {
      free: 114952291739703942493,
      reserved: 0,
      miscFrozen: 0,
      feeFrozen: 0,
    },
  },
  { free: 15539959710296, reserved: 0, frozen: 0 },
  { free: 8984460040289704, reserved: 0, frozen: 0 },
  {
    shares: "0x0000000000000000008e1bc9bf040000",
    ammPoolId: "bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY",
    yieldFarmEntries: [
      {
        globalFarmId: 10,
        yieldFarmId: 14,
        valuedShares: "0x000000000000000000944bf43bacbc41",
        accumulatedRpvs: 0,
        accumulatedClaimedRewards: 0,
        enteredAt: 1532800,
        updatedAt: 1532800,
      },
      {
        globalFarmId: 12,
        yieldFarmId: 15,
        valuedShares: 852039496445,
        accumulatedRpvs: 0,
        accumulatedClaimedRewards: 0,
        enteredAt: 1532803,
        updatedAt: 1532803,
      },
    ],
  },
]

// yield farm id: 12 (global farm: 10, ammId: bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY)