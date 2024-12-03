import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor"
import * as raffleIDL from "./raffle/raffle.json"
import {Raffle} from "./raffle/raffle"


async function main() {
    console.info(`> Started APP`);

    try {

        const publicKey = new PublicKey("wrprFD8nubz7iB3pKfuMiUjcydQNoCL5eWnEPMbG1F6")
        const connection = new Connection("https://devnet.helius-rpc.com/?api-key=b6dabcac-85da-4d27-b304-1e4e076f7c3f");


        const wallet = new anchor.Wallet(Keypair.generate() as any);
        const provider = new anchor.AnchorProvider(connection as any, wallet)
        const raffle = new anchor.Program<Raffle>(raffleIDL as Raffle, provider)

        //Event Listener

        const listener = raffle.addEventListener("eventBuyTicket", (event, slot, signature) => {
            console.log(`Event received @slot=${slot} \nsignaure=${signature}\ndata=${JSON.stringify(event, null, 3)}`)
        });


    } catch (e) {
        console.error('Subscription error', e);
    } finally {
        console.info(`> Creaed WS...`);
    }
}

main();