const order = {};

export const signOrder = (id, { day, time, guests, wishes }) => {
	order[id] = { day, time, guests, wishes };
};

export const getBookingData = (id) => {
  return order[id];
};