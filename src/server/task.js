const fs = require("fs/promises");
const { getDollarBsPrice } = require("dollar-bs-price-scrapper");

const historicalPath = process.cwd().concat("/historical.json");

const getHistorical = () => fs.readFile(historicalPath).then(r => JSON.parse(r));

const getDifferenceFromLastPrice = function( historical, current ){

    const last = historical[0];

    if( !last ) return {};

    const percentage = current.number * 100 / last.number - 100;
    const sign = Math.sign(percentage);

    const types = {
        "0": "equal",
        "1": "increment",
        "-1": "decrement"
    };

    const type = types[sign];
    const value = percentage.toFixed(2).concat("%");

    return { type, value }

}

const secs = n => new Promise(resolve => setTimeout(resolve, n * 1000));

module.exports = sockets => async () => {

    let retry = 0, maxRetry = 3, success;

    do {
    
        sockets.emit("updatingDollar");

        try {

            const historical = await getHistorical();
            const dollarPrice = await getDollarBsPrice();

            if( !dollarPrice ) throw null
        
            const result = { ...dollarPrice }

            result.differenceFromLastPrice = getDifferenceFromLastPrice(historical, dollarPrice);

            result.date = {
                get time(){
                    const date = new Date();
                    return date.setHours(date.getHours(), 0, 0, 0)
                },
                get formatted(){
                    return new Date(this.time)
                    .toLocaleString("es-ES", {
                        hour12: true, month: "2-digit",
                        day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                    })
                }
            }

            const newHistorical = [ result, ...historical ];
            
            await fs.writeFile(
                historicalPath,
                JSON.stringify(newHistorical, undefined, 4)
            )

            sockets.emit("dollarUpdated", newHistorical);
            success = true;

        } catch {
            
            sockets.emit("dollarUpdateFails", retry);
            retry++;

            await secs(3);
        
        }

    } while( retry < maxRetry && !success )

}