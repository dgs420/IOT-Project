const RfidCard = require("../models/rfidCardModel");

exports.createGuestCard = async function ({ card_number }) {
  const existingCard = await RfidCard.findOne({
    where: {
      card_number: card_number,
    },
  });

  if (existingCard) {
    throw { code: 400, message: "This card is already added." };
  }
  return await RfidCard.create({
    card_number: card_number,
    is_guest: true,
  });
};

exports.findByNumber = async (card_number) =>
  RfidCard.findOne({
    where: { card_number },
    include: [{ model: User }],
  });
