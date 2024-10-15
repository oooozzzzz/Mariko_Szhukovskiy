import { InlineKeyboard } from "grammy";

export const confirmBookingKeyboard = new InlineKeyboard()
	.text("Да, все верно", "yes")
	.row()
	.text("Не совсем..", "no")
	.row()
	.text("Отменить бронирование", "cancelBooking");