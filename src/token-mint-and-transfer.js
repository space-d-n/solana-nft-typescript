const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {

    //Create connection to devnet
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));

    //Generate keypair and airdrop 1000000000 Lamports (1 SOL)
    const myKeypair = web3.Keypair.generate();
    console.log(`myKeypair ${myKeypair.publicKey}`)

    let airdropSignature = await connection.requestAirdrop(
        myKeypair.publicKey, 1000000000
    );

    await connection.confirmTransaction(airdropSignature);
    console.log('Solana public address: ' + myKeypair.publicKey.toBase58());

    //Create mint
    let mintPbK = await splToken.createMint(connection, myKeypair, myKeypair.publicKey, null, 0, web3.Keypair.generate(), splToken.TOKEN_PROGRAM_ID)
    console.log(mintPbK)
    console.log('Mint public address: ' + mintPbK.toBase58());

    //Get the token accont of this solana address, if it does not exist, create it
    let myATA = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        payer = myKeypair,
        mintPbK = mintPbK,
        owner = myKeypair.publicKey,
        commitment = 'finalized',
        allowOwnerOffCurve = false,
        confirmOptions = null,
        programId = splToken.TOKEN_PROGRAM_ID,
        associatedTokenProgramId = splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    )
    console.log('Token public address: ' + myATA.address.toBase58());

    //Minting 100 new tokens to the token address we just created
    let mintToTx = await splToken.mintTo(
        connection,
        payer = myKeypair,
        mintPbK = mintPbK,
        destination = myATA.address,
        authority = myKeypair,
        amount = 100,
        multiSigners = [myKeypair],
        confirmOptions = false,
        programId = splToken.TOKEN_PROGRAM_ID,
    );

    console.log(mintToTx);
    //Same thing here, creating or getting account to transfer our nft
    let nftReceiverKeypair = web3.Keypair.generate();
    let nftReceiverATA = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        payer = myKeypair,
        mintPbK = mintPbK,
        owner = nftReceiverKeypair.publicKey,
        commitment = 'finalized',
        allowOwnerOffCurve = false,
        confirmOptions = null,
        programId = splToken.TOKEN_PROGRAM_ID,
        associatedTokenProgramId = splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    console.log(nftReceiverKeypair.publicKey.toBase58(), 'Reciver addr')

    try {
        await transferTokens(myKeypair, connection, 1, nftReceiverATA, myATA)
    } catch (error) {
        console.log(error)
    }

    console.log('Done')
})();

async function transferTokens(wallet, connection, amount, nftReciverATA, nftSenderATA) {
    const transferTx = await splToken.transfer(
        connection,
        payer = wallet,
        source = nftSenderATA.address,
        destination = nftReciverATA.address,
        owner = wallet,
        amount = amount,
        multiSigners = [wallet],
        confirmOptions = false,
        programId = splToken.TOKEN_PROGRAM_ID,
    )

    console.log("Transcation signature", transferTx);
    console.log("Success!");
}