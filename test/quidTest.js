const { expect, use } = require("chai");
const { ethers, deployments } = require("hardhat");
const { BigNumber } = require("ethers");
const { solidity, loadFixture, deployContract } = require("ethereum-waffle");

use(solidity);




function getCurrentTimeStamp()
{
  var timeStamp = Math.floor(Date.now() / 1000);
  return timeStamp;
}

describe("Investor Controller", function () {
  beforeEach(async () => {
    
  [deployer, companyOwner, companyOwner2, investor] = await ethers.getSigners();

  const DNS = await ethers.getContractFactory("DNS");
  const CompanyController = await ethers.getContractFactory("CompanyController");
  const CompanyRoundController = await ethers.getContractFactory("CompanyRoundController");
  const CompanyProposalController = await ethers.getContractFactory("CompanyProposalController");
  const InvestorController = await ethers.getContractFactory("InvestorController");
  const CompanyProxy = await ethers.getContractFactory("CompanyProxy");
  const InvestorProxy = await ethers.getContractFactory("InvestorProxy");
  const EventEmitter = await ethers.getContractFactory("EventEmitter",);
  const IdentityContract = await ethers.getContractFactory("IdentityContract");
  const QuidRaiseShares = await ethers.getContractFactory("QuidRaiseShares");
  const CompanyStore = await ethers.getContractFactory("CompanyStore");
  const InvestorStore = await ethers.getContractFactory("InvestorStore");
  const ProposalStore = await ethers.getContractFactory("ProposalStore");
  const RoundStore = await ethers.getContractFactory("RoundStore");
  const CompanyVaultStore = await ethers.getContractFactory("CompanyVaultStore");
  const CompanyVault = await ethers.getContractFactory("CompanyVault");
  const Config = await ethers.getContractFactory("Config");
  const Treasury = await ethers.getContractFactory("Treasury");

  dns = await DNS.deploy();
  companyRoundController = await CompanyRoundController.deploy(dns.address)
  companyProposalController = await CompanyProposalController.deploy(dns.address)
  companyController = await CompanyController.deploy(dns.address)
  investorController = await InvestorController.deploy(dns.address)
  treasury = await Treasury.deploy();
  identityContract = await IdentityContract.deploy(dns.address);
  eventEmitter = await EventEmitter.deploy(dns.address)
  nft = await QuidRaiseShares.deploy("", dns.address)
  companyStore = await CompanyStore.deploy(dns.address)
  investorStore = await InvestorStore.deploy(dns.address)
  proposalStore = await ProposalStore.deploy(dns.address)
  roundStore = await RoundStore.deploy(dns.address)
  companyVaultStore = await CompanyVaultStore.deploy(dns.address)
  companyVault = await CompanyVault.deploy(dns.address)
 
  companyProxy = await CompanyProxy.deploy(dns.address)
  investorProxy = await InvestorProxy.deploy(dns.address)

  config = await Config.deploy()



  // console.log(`Identity Contract Address: ${identityContract.address}`);
  // console.log(`Event Emitter Contract Address: ${eventEmitter.address}`);
  // console.log(`Treasury Contract Address: ${treasury.address}`);
  // console.log(`DNS Contract Address: ${dns.address}`);
  // console.log(`NFT Contract Address: ${nft.address}`);
  // console.log(`Company Store Contract Address: ${companyStore.address}`);
  // console.log(`Investor Store Contract Address: ${investorStore.address}`);
  // console.log(`Proposal Store Contract Address: ${proposalStore.address}`);
  // console.log(`Round Store Contract Address: ${roundStore.address}`);
  // console.log(`Company Vault Store Contract Address: ${companyVaultStore.address}`);
  // console.log(`Company Vault Contract Address: ${companyVault.address}`);
  // console.log(`Company Controller Contract Address: ${companyController.address}`);
  // console.log(`Company Round Controller Contract Address: ${companyRoundController.address}`);
  // console.log(`Company Proposal Controller Contract Address: ${companyProposalController.address}`);
  // console.log(`Investor Controller Contract Address: ${investorController.address}`);
  // console.log(`Company Proxy Contract Address: ${companyProxy.address}`);
  // console.log(`Investor Proxy Contract Address: ${investorProxy.address}`);
  // console.log(`Config Contract Address: ${config.address}`);


  await dns.setRoute("IDENTITY_CONTRACT", identityContract.address);
  await dns.setRoute("EVENT_EMITTER", eventEmitter.address);
  await dns.setRoute("COMPANY_VAULT_STORE", companyVaultStore.address);
  await dns.setRoute("COMPANY_VAULT", companyVault.address);
  await dns.setRoute("COMPANY_STORE", companyStore.address);
  await dns.setRoute("INVESTOR_STORE", investorStore.address);
  await dns.setRoute("PROPOSAL_STORE", proposalStore.address);
  await dns.setRoute("ROUND_STORE", roundStore.address);
  await dns.setRoute("NFT", nft.address);
  await dns.setRoute("CONFIG", config.address);
  await dns.setRoute("COMPANY_CONTROLLER", companyController.address);
  await dns.setRoute("COMPANY_ROUND_CONTROLLER", companyRoundController.address);
  await dns.setRoute("COMPANY_PROPOSAL_CONTROLLER", companyProposalController.address);

  await dns.setRoute("INVESTOR_CONTROLLER", investorController.address);  

  // console.log("Routes Set Successfully");



  await config.setNumericConfig("MAX_ROUND_PAYMENT_OPTION", BigNumber.from("4"));
  await config.setNumericConfig("PLATFORM_COMMISION", BigNumber.from("1"));
  await config.setNumericConfig("PRECISION", BigNumber.from("100"));
  await config.setNumericConfig("VOTE_DURATION", BigNumber.from("600"));

  // console.log("Config Set Successfully");

  await identityContract.activateDataAccess(companyController.address); 
  await identityContract.activateDataAccess(investorController.address); 
  await identityContract.activateDataAccess(deployer.address);

  await identityContract.grantContractInteraction(identityContract.address, eventEmitter.address)
  await identityContract.grantContractInteraction(companyController.address, eventEmitter.address)
  await identityContract.grantContractInteraction(companyController.address, config.address)
  await identityContract.grantContractInteraction(companyController.address, identityContract.address)
  await identityContract.grantContractInteraction(companyController.address, companyVaultStore.address)
  await identityContract.grantContractInteraction(companyController.address, roundStore.address)
  await identityContract.grantContractInteraction(companyController.address, proposalStore.address)
  await identityContract.grantContractInteraction(companyController.address, investorStore.address)
  await identityContract.grantContractInteraction(companyController.address, companyStore.address)
  await identityContract.grantContractInteraction(companyController.address, companyVault.address)

  await identityContract.grantContractInteraction(companyRoundController.address, eventEmitter.address)
  await identityContract.grantContractInteraction(companyRoundController.address, config.address)
  await identityContract.grantContractInteraction(companyRoundController.address, identityContract.address)
  await identityContract.grantContractInteraction(companyRoundController.address, companyVaultStore.address)
  await identityContract.grantContractInteraction(companyRoundController.address, roundStore.address)
  await identityContract.grantContractInteraction(companyRoundController.address, proposalStore.address)
  await identityContract.grantContractInteraction(companyRoundController.address, investorStore.address)
  await identityContract.grantContractInteraction(companyRoundController.address, companyStore.address)
  await identityContract.grantContractInteraction(companyRoundController.address, companyVault.address)


  await identityContract.grantContractInteraction(companyProposalController.address, eventEmitter.address)
  await identityContract.grantContractInteraction(companyProposalController.address, config.address)
  await identityContract.grantContractInteraction(companyProposalController.address, identityContract.address)
  await identityContract.grantContractInteraction(companyProposalController.address, companyVaultStore.address)
  await identityContract.grantContractInteraction(companyProposalController.address, roundStore.address)
  await identityContract.grantContractInteraction(companyProposalController.address, proposalStore.address)
  await identityContract.grantContractInteraction(companyProposalController.address, investorStore.address)
  await identityContract.grantContractInteraction(companyProposalController.address, companyStore.address)
  await identityContract.grantContractInteraction(companyProposalController.address, companyVault.address)



  await identityContract.grantContractInteraction(investorController.address, companyVault.address)
  await identityContract.grantContractInteraction(companyVault.address, companyVaultStore.address)
  await identityContract.grantContractInteraction(investorController.address, companyVaultStore.address)
  await identityContract.grantContractInteraction(investorController.address, roundStore.address)
  await identityContract.grantContractInteraction(investorController.address, nft.address)
  await identityContract.grantContractInteraction(investorController.address, identityContract.address)
  await identityContract.grantContractInteraction(investorController.address, eventEmitter.address)

  await identityContract.grantContractInteraction(investorController.address, proposalStore.address)
  await identityContract.grantContractInteraction(investorController.address, investorStore.address)
  await identityContract.grantContractInteraction(investorController.address, companyStore.address)
 
  await identityContract.grantContractInteraction(companyProxy.address, companyController.address);
  await identityContract.grantContractInteraction(companyProxy.address, companyProposalController.address);
  await identityContract.grantContractInteraction(companyProxy.address, companyRoundController.address);

  await identityContract.grantContractInteraction(investorProxy.address, investorController.address);
  // console.log("Identity Access Grant Set Successfully");

  await companyProxy.activateDataAccess(deployer.address);


  // console.log("Auth Access Granted");

  // DEPLOY PAYMENT OPTIONS
  const Contract = await ethers.getContractFactory("ERC20Token");
  companyToken = await Contract.deploy("LazerPay", "LP");
  companyToken2 = await Contract.deploy("Wicrypt", "WNT");

  // SEND TOKENS TO COMPANY OWNERS TO USE IN CREATING ROUNDS
  await companyToken.transfer(companyOwner.address, BigNumber.from("31000000000000000000000000"))
  await companyToken2.transfer(companyOwner2.address, BigNumber.from("31000000000000000000000000"))

  const usdtContract = await ethers.getContractFactory("ERC20Token");
  Usdt = await usdtContract.deploy("USDT tether", "USDT");

  const daiContract = await ethers.getContractFactory("ERC20Token");
  Dai = await daiContract.deploy("DAI Token", "DAI");

  const busdContract = await ethers.getContractFactory("ERC20Token");
  Busd = await busdContract.deploy("Binance BUSD", "BUSD");

  const USDContract = await ethers.getContractFactory("ERC20Token");
  Usdc = await USDContract.deploy("USDC", "USDC");

  console.log(`Usdt Contract Address: ${Usdt.address}`);
  console.log(`Dai Contract Address: ${Dai.address}`);
  console.log(`Busd Contract Address: ${Busd.address}`);
  console.log(`Usdc Contract Address: ${Usdc.address}`);
  console.log(`companyToken Contract Address: ${companyToken.address}`);
  console.log(`companyToken2 Contract Address: ${companyToken2.address}`);


  await Usdt.transfer(investor.address, BigNumber.from("31000000000000000000000000"))
  await Dai.transfer(investor.address, BigNumber.from("31000000000000000000000000"))
  await Busd.transfer(investor.address, BigNumber.from("31000000000000000000000000"))
  await Usdc.transfer(investor.address, BigNumber.from("31000000000000000000000000"))


  await companyVaultStore.enablePaymentOption(Usdt.address);
  await companyVaultStore.enablePaymentOption(Dai.address);
  await companyVaultStore.enablePaymentOption(Busd.address);
  await companyVaultStore.enablePaymentOption(Usdc.address);


  });

  it("should createCompany", async function () {

    const companyUrl =  "https://www.lazerpay.finance/";
    const companyName = "Lazer Pay";
    

    await expect(companyProxy
      .connect(deployer)
      .createCompany(companyUrl, companyName, companyToken.address, companyOwner.address))
      .to.emit(eventEmitter, "CompanyCreated")
         .withArgs
         (
           1,
           companyOwner.address,
           deployer.address,
           companyName,
           companyUrl,
           companyToken.address
         );


  });

  it("should create round", async function () {

    const companyUrl =  "https://www.lazerpay.finance/";
    const companyName = "Lazer Pay";
    const roundDocumentUrl = "https://cdn.invictuscapital.com/reports/2021_QR3.pdf"
    const tokensSuppliedForRound  = BigNumber.from("10000000000000000000000");
    const startTimestamp = getCurrentTimeStamp();
    const duration = BigNumber.from("1296000");
    const lockupPeriod = BigNumber.from("1000");
    const paymentCurrencies = [ Usdt.address, Dai.address, Busd.address, Usdc.address ];
    const pricePerShare = [ BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000") ];
    const runTillFullySubscribed = false;
    
    await expect(companyProxy
      .connect(deployer)
      .createCompany(companyUrl, companyName, companyToken.address, companyOwner.address))
      .to.emit(eventEmitter, "CompanyCreated")
         .withArgs
         (
           1,
           companyOwner.address,
           deployer.address,
           companyName,
           companyUrl,
           companyToken.address
         );

    await companyToken.connect(companyOwner).approve(companyRoundController.address,tokensSuppliedForRound)


    
    await expect(companyProxy
      .connect(companyOwner)
      .createRound(roundDocumentUrl, startTimestamp, duration, lockupPeriod, companyATokenAllocation, runTillFullySubscribed, paymentCurrencies, pricePerShare))
      .to.emit(eventEmitter, "RoundCreated")
         .withArgs(
            1,
            1,
            companyOwner.address,
            lockupPeriod,
            tokensSuppliedForRound,
            startTimestamp,
            duration,
            runTillFullySubscribed,
            paymentCurrencies,
            pricePerShare
         ) ;

    
  });

  it("should create round that will run till fully subscribed", async function () {

    const companyUrl =  "https://www.lazerpay.finance/";
    const companyName = "Lazer Pay";
    const roundDocumentUrl = "https://cdn.invictuscapital.com/reports/2021_QR3.pdf"
    const tokensSuppliedForRound  = BigNumber.from("10000000000000000000000");
    const startTimestamp = getCurrentTimeStamp();
    const duration = BigNumber.from("0");
    const lockupPeriod = BigNumber.from("1000");
    const paymentCurrencies = [ Usdt.address, Dai.address, Busd.address, Usdc.address ];
    const pricePerShare = [ BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000") ];
    const runTillFullySubscribed = true;
    
    await expect(companyProxy
      .connect(deployer)
      .createCompany(companyUrl, companyName, companyToken.address, companyOwner.address))
      .to.emit(eventEmitter, "CompanyCreated")
         .withArgs
         (
           1,
           companyOwner.address,
           deployer.address,
           companyName,
           companyUrl,
           companyToken.address
         );

         
  await companyToken.connect(companyOwner).approve(companyRoundController.address,tokensSuppliedForRound)
    
    await expect(companyProxy
      .connect(companyOwner)
      .createRound(roundDocumentUrl, startTimestamp, duration, lockupPeriod, companyATokenAllocation, runTillFullySubscribed, paymentCurrencies, pricePerShare))
      .to.emit(eventEmitter, "RoundCreated")
         .withArgs(
            1,
            1,
            companyOwner.address,
            lockupPeriod,
            tokensSuppliedForRound,
            startTimestamp,
            duration,
            runTillFullySubscribed,
            paymentCurrencies,
            pricePerShare
         ) ;
  });

  it("should invest in round", async function () {

    const companyUrl =  "https://www.lazerpay.finance/";
    const companyName = "Lazer Pay";
    const roundDocumentUrl = "https://cdn.invictuscapital.com/reports/2021_QR3.pdf"
    const tokensSuppliedForRound  = BigNumber.from("10000000000000000000000");
    const startTimestamp = getCurrentTimeStamp();
    const duration = BigNumber.from("1296000");
    const lockupPeriod = BigNumber.from("1000");
    const paymentCurrencies = [ Usdt.address, Dai.address, Busd.address, Usdc.address ];
    const pricePerShare = [ BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000"), BigNumber.from("1000000000000000000") ];
    const runTillFullySubscribed = false;
    const amountInvested = BigNumber.from("5000000000000000000000");
    const expectedTokenQuantityPurchased = BigNumber.from("5000000000000000000000");
    
    await expect(companyProxy
      .connect(deployer)
      .createCompany(companyUrl, companyName, companyToken.address, companyOwner.address))
      .to.emit(eventEmitter, "CompanyCreated")
         .withArgs
         (
           1,
           companyOwner.address,
           deployer.address,
           companyName,
           companyUrl,
           companyToken.address
         );

    await companyToken.connect(companyOwner).approve(companyRoundController.address,tokensSuppliedForRound)


    
    await expect(companyProxy
      .connect(companyOwner)
      .createRound(roundDocumentUrl, startTimestamp, duration, lockupPeriod, companyATokenAllocation, runTillFullySubscribed, paymentCurrencies, pricePerShare))
      .to.emit(eventEmitter, "RoundCreated")
         .withArgs(
            1,
            1,
            companyOwner.address,
            lockupPeriod,
            tokensSuppliedForRound,
            startTimestamp,
            duration,
            runTillFullySubscribed,
            paymentCurrencies,
            pricePerShare
         ) ;

    await Usdt.connect(investor).approve(investorController.address,amountInvested)

    await expect(await investorProxy.connect(investor).investInRound(1,Usdt.address))
          .to.emit(eventEmitter, "InvestmentDeposit")
          .withArgs(
            1,
            1,
            investor.address,
            Usdt.address,
            amountInvested,
            expectedTokenQuantityPurchased
          );

    let record = await roundStore.getRecord(1);
    console.log({record});
   
    let investmentVaultContract = await ethers.getContractAt("ERC20Token",record.TokenLockVaultAddres);

    expect(await deviceContract.balanceOf(record.TokenLockVaultAddres)).to.equal(expectedTokenQuantityPurchased);
    
  });



})




// describe("Deployment of Contracts", function () {
//   before(async () => {
//     DNS = await ethers.getContractFactory("DNS");
//     CompanyController = await ethers.getContractFactory("CompanyController");
//     InvestorController = await ethers.getContractFactory("InvestorController");
//     EventEmitter = await ethers.getContractFactory("EventEmitter");
//     IdentityContract = await ethers.getContractFactory("IdentityContract");
//     QuidRaiseShares = await ethers.getContractFactory("QuidRaiseShares");
//     CompanyStore = await ethers.getContractFactory("CompanyStore");
//     InvestorStore = await ethers.getContractFactory("InvestorStore");
//     ProposalStore = await ethers.getContractFactory("ProposalStore");
//     RoundStore = await ethers.getContractFactory("RoundStore");
//     CompanyVaultStore = await ethers.getContractFactory("CompanyVaultStore");
//     CompanyVault = await ethers.getContractFactory("CompanyVault");
//     Config = await ethers.getContractFactory("Config");
//     Treasury = await ethers.getContractFactory("Treasury");

//     dns = await DNS.deploy();

//     treasury = await Treasury.deploy();
//     identityContract = await IdentityContract.deploy(dns.address);
//     eventEmitter = await EventEmitter.deploy(dns.address);
//     nft = await QuidRaiseShares.deploy("", dns.address);
//     companyStore = await CompanyStore.deploy(dns.address);
//     investorStore = await InvestorStore.deploy(dns.address);
//     proposalStore = await ProposalStore.deploy(dns.address);
//     roundStore = await RoundStore.deploy(dns.address);
//     companyVaultStore = await CompanyVaultStore.deploy(dns.address);
//     companyVault = await CompanyVault.deploy(dns.address);
//     companyController = await CompanyController.deploy(dns.address);
//     investorController = await InvestorController.deploy(dns.address);

//     config = await Config.deploy();
//   });

//   it("should set the contracts routes", async () => {
//     await dns.setRoute("IDENTITY_CONTRACT", identityContract.address);
//     await dns.setRoute("EVENT_EMITTER", eventEmitter.address);
//     await dns.setRoute("COMPANY_VAULT_STORE", companyVaultStore.address);
//     await dns.setRoute("COMPANY_VAULT", companyVault.address);
//     await dns.setRoute("COMPANY_STORE", companyStore.address);
//     await dns.setRoute("INVESTOR_STORE", investorStore.address);
//     await dns.setRoute("PROPOSAL_STORE", proposalStore.address);
//     await dns.setRoute("ROUND_STORE", roundStore.address);
//     await dns.setRoute("NFT", nft.address);
//     await dns.setRoute("CONFIG", config.address);
//     await dns.setRoute("COMPANY_CONTROLLER", companyController.address);
//     await dns.setRoute("INVESTOR_CONTROLLER", investorController.address);
//   });

//   it("should set the configurations", async () => {
//     await config.setNumericConfig("MAX_ROUND_PAYMENT_OPTION", BigNumber.from("3"));
//     await config.setNumericConfig("PLATFORM_COMMISION", BigNumber.from("1"));
//     await config.setNumericConfig("PRECISION", BigNumber.from("100"));
//   });

//   it("should grant access to contracts ", async () => {
//     await identityContract.grantContractInteraction(identityContract.address, eventEmitter.address);
//     await identityContract.grantContractInteraction(companyController.address, eventEmitter.address);
//     await identityContract.grantContractInteraction(investorController.address, eventEmitter.address);
//     await identityContract.grantContractInteraction(companyController.address, config.address);
//     await identityContract.grantContractInteraction(companyController.address, identityContract.address);
//     await identityContract.grantContractInteraction(companyController.address, companyVault.address);
//     await identityContract.grantContractInteraction(investorController.address, companyVault.address);
//     await identityContract.grantContractInteraction(companyVault.address, companyVaultStore.address);
//     await identityContract.grantContractInteraction(companyVault.address, companyStore.address);
//     await identityContract.grantContractInteraction(companyController.address, companyVaultStore.address);
//     await identityContract.grantContractInteraction(investorController.address, companyVaultStore.address);
//     await identityContract.grantContractInteraction(investorController.address, roundStore.address);
//     await identityContract.grantContractInteraction(investorController.address, proposalStore.address);
//     await identityContract.grantContractInteraction(investorController.address, investorStore.address);
//     await identityContract.grantContractInteraction(investorController.address, companyStore.address);
//     await identityContract.grantContractInteraction(companyController.address, roundStore.address);
//     await identityContract.grantContractInteraction(companyController.address, proposalStore.address);
//     await identityContract.grantContractInteraction(companyController.address, investorStore.address);
//     await identityContract.grantContractInteraction(companyController.address, companyStore.address);
//   });
// });

// let createCompany,companyToken, Usdt, Dai, Busd, Usdc;

// describe("Company Controller Contract", function () {
//   before(async () => {
//     [tester, addr1, addr2, addr3] = await ethers.getSigners();
//     await identityContract.grantContractInteraction(tester.address, companyController.address);
//     await identityContract.activateDataAcess(companyController.address);
//     await identityContract.grantContractInteraction(tester.address, investorStore.address);
//     await identityContract.activateDataAcess(investorStore.address);

//     // DEPLOY PAYMENT OPTIONS
//     const Contract = await ethers.getContractFactory("ERC20Token");
//     companyToken = await Contract.deploy("QuidToken","QT");

//     const usdtContract = await ethers.getContractFactory("ERC20Token");
//     Usdt = await usdtContract.deploy("USDT tether","USDT");

//     const daiContract = await ethers.getContractFactory("ERC20Token");
//     Dai = await daiContract.deploy("DAI Token","DAI");

//     const busdContract = await ethers.getContractFactory("ERC20Token");
//     Busd = await busdContract.deploy("Binance BUSD","BUSD");

//     const USDContract = await ethers.getContractFactory("ERC20Token");
//     Usdc = await USDContract.deploy("USDC","USDC");

//     // ENABLE PAYMENT OPTIONS
//     await companyVaultStore.enablePaymentOption(Usdt.address);
//     await companyVaultStore.enablePaymentOption(Dai.address);
//     await companyVaultStore.enablePaymentOption(Busd.address);
//     await companyVaultStore.enablePaymentOption(Usdc.address);

//     // CREATE NEW COMPANY
//     COMPANY_URL = "https://quidraise.co";
//     COMPANY_NAME = "Quid Raise";
//     COMPANY_OWNER = tester.address;
//     COMPANY_CREATED_BY = tester.address;
//     COMPANY_TOKEN_CONTRACT_ADDRESS = companyToken.address;

//     createCompany = await companyController
//       .connect(tester)
//       .createCompany(COMPANY_URL, COMPANY_NAME, COMPANY_TOKEN_CONTRACT_ADDRESS, COMPANY_OWNER, COMPANY_CREATED_BY);

//     // CREATE NEW ROUND
//     companyOwner = COMPANY_OWNER;
//     roundDocumentUrl = "https://whitepaper.quidraise.co";
//     startTimestamp = Date.now();
//     duration = 172800; // two days
//     lockupPeriodForShare = 604800; // one week
//     tokensSuppliedForRound = 20000;
//     runTillFullySubscribed = true;
//     paymentCurrencies = [Usdt.address, Dai.address];
//     pricePerShare = [100, 100];
//   });

//   describe("createCompany function", () => {
//     it("should emit event if company was created successfully", async function () {

        

//       expect(createCompany).to.emit(eventEmitter, "CompanyCreated");
//     });

//     it("should fail if company owner already owns a business", async () => {
//       await expect(
//         companyController.connect(tester).createCompany(COMPANY_URL, COMPANY_NAME, COMPANY_TOKEN_CONTRACT_ADDRESS, COMPANY_OWNER, COMPANY_CREATED_BY),
//       ).to.be.revertedWith("Company owner already owns a business");
//     });

//     it("should fail if company owner is already an investor", async () => {
//       let isInvestor = await investorStore.connect(tester).isInvestor(COMPANY_OWNER);
//       expect(isInvestor).to.equal(false);
//     });

//     it("should ensure company owner is whitelisted", async () => {
//       let companyOwnerIsWhitelisted = await identityContract.isCompanyAddressWhitelisted(COMPANY_OWNER);
//       expect(companyOwnerIsWhitelisted).to.equal(true);
//     });

//     it("should ensure company is whitelisted", async () => {
//       let companyIsWhitelisted = await identityContract.isCompanyWhitelisted(1);
//       expect(companyIsWhitelisted).to.equal(true);
//     });
//   });

//   describe("createRound function", () => {
//     before(async () => {});

//     it("should fail if payment options exceed the max round payment option", async () => {
//       let paymentCurrencies = [Usdt.address, Dai.address, Busd.address, Usdc.address];
//       let pricePerShare = [100, 100, 100, 100];
//       await expect(
//         companyController
//           .connect(tester)
//           .createRound(
//             companyOwner,
//             roundDocumentUrl,
//             startTimestamp,
//             duration,
//             lockupPeriodForShare,
//             tokensSuppliedForRound,
//             runTillFullySubscribed,
//             paymentCurrencies,
//             pricePerShare,
//           ),
//       ).to.be.revertedWith("Exceeded number of payment options");
//     });

//     it("should fail if price per share is zero", async () => {
//       let pricePerShare = [0, 0, 0, 0];
//       await expect(
//         companyController
//           .connect(tester)
//           .createRound(
//             companyOwner,
//             roundDocumentUrl,
//             startTimestamp,
//             duration,
//             lockupPeriodForShare,
//             tokensSuppliedForRound,
//             runTillFullySubscribed,
//             paymentCurrencies,
//             pricePerShare,
//           ),
//       ).to.be.revertedWith("Price per share cannot be zero");
//     });

//     it("should fail if input data is invaild", async () => {
//       let startTimestamp = 0,
//         duration = 0,
//         tokensSuppliedForRound = 0,
//         paymentCurrencies = [],
//         pricePerShare = [];

//       await expect(
//         companyController
//           .connect(tester)
//           .createRound(
//             companyOwner,
//             roundDocumentUrl,
//             startTimestamp,
//             duration,
//             lockupPeriodForShare,
//             tokensSuppliedForRound,
//             runTillFullySubscribed,
//             paymentCurrencies,
//             pricePerShare,
//           ),
//       ).to.be.revertedWith("Contract input data is invalid");
//     });
//     it("should fail if round creator is not a company owner", async () => {

//       let companyOwner = addr1.address;
//       await expect(
//         companyController
//           .connect(tester)
//           .createRound(
//             companyOwner,
//             roundDocumentUrl,
//             startTimestamp,
//             duration,
//             lockupPeriodForShare,
//             tokensSuppliedForRound,
//             runTillFullySubscribed,
//             paymentCurrencies,
//             pricePerShare,
//           ),
//       ).to.be.revertedWith("Could not find a company owned by this user");
//     });
//     it("should get company details by company owner address", async ()=>{
//       let companyByOwner = await companyStore.callStatic.getCompanyByOwner(companyOwner);
//       expect(companyByOwner.CompanyName).to.equal("Quid Raise");
//     })

//     it("should ensure company is whitelisted", async () => {
//       let companyIsWhitelisted = await identityContract.isCompanyWhitelisted(1);
//       expect(companyIsWhitelisted).to.equal(true);
//     });

//     it("should ensure company owner is whitelisted", async () => {
//       let companyOwnerIsWhitelisted = await identityContract.isCompanyAddressWhitelisted(COMPANY_OWNER);
//       expect(companyOwnerIsWhitelisted).to.equal(true);
//     });

//     it("should fail if company has an open round", async () => {

//       // let companyid = await companyStore.getCompanyById(1);
//       // console.log(companyid);
//       await companyToken.approve(companyController.address, BigNumber.from("20000"));
//       let createRound = await companyController
//           .connect(tester)
//           .createRound(
//             companyOwner,
//             roundDocumentUrl,
//             startTimestamp,
//             duration,
//             lockupPeriodForShare,
//             tokensSuppliedForRound,
//             runTillFullySubscribed,
//             paymentCurrencies,
//             pricePerShare,
//           );
//           console.log(createRound)

//     })


//   });
// });