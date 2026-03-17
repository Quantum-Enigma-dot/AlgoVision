export const parseArray = (text) => {
  if (!text) return [];
  return text
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => Number(value));
};

export const parseNodes = (text) => {
  if (!text) return [];
  return text.split(",").map((value) => value.trim()).filter(Boolean);
};

export const parseEdges = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [from, to, weight] = line.split(",").map((item) => item.trim());
      return {
        from,
        to,
        weight: weight ? Number(weight) : 1
      };
    });
};
