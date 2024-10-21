const order = {};

export const signOrder = (id, { day, time, guests, wishes, number }) => {
	order[id] = { day, time, guests, wishes, number };
};

export const getBookingData = (id) => {
  return order[id];
};