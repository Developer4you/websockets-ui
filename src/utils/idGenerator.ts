let lastId = 0;

export const generateId = (): string => {
    return `${Date.now()}-${++lastId}`;
};