export const clamp = (val, min, max) => {
    if(val < min) return parseInt(min);
    if(val > max) return parseInt(max);
    return parseInt(val);
}