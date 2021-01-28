import {replyStockPriceTicker,getTickerNameFromMention } from "../src/b3-api-sdk";
export async function entities(entities,message) {
    entities.forEach(async entity => {
        if (entity.type == 'hashtag') {
            return await entityHashtag(entity,message);
        }
        if (entity.type == 'bot_command') {
            return await entityBotCommand(entity,message);
        }
    });
}

export async function entityHashtag(message,entity) {
    const ticker = getTickerNameFromMention(message, entity);
    return replyStockPriceTicker(message, ticker);
}

export async function entityBotCommand(entity,message) {
    //precisa implementar
}