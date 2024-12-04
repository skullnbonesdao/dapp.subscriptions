import 'dotenv/config'
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor"
import * as raffleIDL from "./raffle/raffle.json"
import {Raffle} from "./raffle/raffle"
import {MessageBuilder, Webhook} from "discord-webhook-node";
import assets from './assets/assets.json'


async function main() {
    console.info(`> Started APP`);

    try {
        const connection = new Connection(process.env.RPC);

        const wallet = new anchor.Wallet(Keypair.generate() as any);
        const provider = new anchor.AnchorProvider(connection as any, wallet)
        const raffle = new anchor.Program<Raffle>(raffleIDL as Raffle, provider)

        const hook = new Webhook(process.env.DISCORD_WEBHOOK);
        hook.setUsername("Raffle BOT")
        hook.setAvatar(process.env.AVATAR)
        hook.send("=== Initalized ===")

        //Event Listener
        const buyListener = raffle.addEventListener("eventBuyTicket", (event, slot, signature) => {
            console.log(`Event received @slot=${slot} \nsignaure=${signature}\ndata=${JSON.stringify(event, null, 3)}`)

            const embed = new MessageBuilder()
                .setTitle(`🎟️ ${event.amount.toString()} Ticket(s) sold 🎟️`)
                .setURL('https://dapp.skullnbones.xyz/#/raffle')
                .setColor('#fce100')
                .setThumbnail(assets.find((asset) => asset.mint == event.prizeMint.toString())?.image)
                .setDescription(`${event.name} - ${event.description}`)
                .addField('SOLD', `${event.sold.toString()}`, true)
                .addField('TOTAL', `${event.total.toString()}`, true)

            hook.send(embed)
        });

        const enableListener = raffle.addEventListener("eventEnable", (event, slot, signature) => {
            console.log(`Event received @slot=${slot} \nsignaure=${signature}\ndata=${JSON.stringify(event, null, 3)}`)
            const embed = new MessageBuilder()
                .setTitle(`🔥 New Raffle available 🔥`)
                .setURL('https://dapp.skullnbones.xyz/#/raffle')
                .setColor('#fce100')
                .setThumbnail(assets.find((asset) => asset.mint == event.prizeMint.toString())?.image)
                .setDescription(`${event.name} - ${event.description}`)
                .addField('Price per ticket', `${parseInt(event.pricePerTicket.toNumber())}`, true)
            hook.send(embed)
        });

        const winnerListener = raffle.addEventListener("eventWinner", (event, slot, signature) => {
            console.log(`Event received @slot=${slot} \nsignaure=${signature}\ndata=${JSON.stringify(event, null, 3)}`)
            const embed = new MessageBuilder()
                .setTitle(`🎉 New winner 🎉`)
                .setURL('https://dapp.skullnbones.xyz/#/raffle')
                .setColor('#fce100')
                .setThumbnail(assets.find((asset) => asset.mint == event.prizeMint.toString())?.image)
                .setDescription(`${event.name} - ${event.description}`)
                .addField('Winner', `${event.winner.toString()}`, false)
            hook.send(embed)
        });


    } catch (e) {
        console.error('Subscription error', e);
    } finally {
        console.info(`> Creaed WS...`);
    }
}

main();