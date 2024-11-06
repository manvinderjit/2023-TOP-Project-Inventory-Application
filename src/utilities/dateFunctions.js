const convertDateISOToYYMMDD = (dateISO) => {
    return JSON.stringify(dateISO).replace(/\"/g, '').split('T', 1)[0];
};

export { convertDateISOToYYMMDD };
